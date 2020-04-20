import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';


class AppointmentController {
    // Appointments for users 
    async index(req, res){

        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId , canceled_at: null},
            order: ['date'],
            limite: 20,
            offset: (page - 1)*20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id','name'],
                    include: [
                        {
                            model: File,
                            as: 'user_picture_file',
                            attributes: ['id','path','url']
                        }
                    ]
                }
            ]
        });
        res.json(appointments);
    }

    async store(req, res){
        
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required()
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validantion Fails'});
        }

        const { provider_id, date } =  req.body;
        
        // Check if user is a provider
        const CheckIsProvider = await User.findOne({
            where: {id: provider_id, provider: true },
        });

        if(!CheckIsProvider){
            return res.status(401).json({error: "You can only create appointments with providers"});
        }

        const hourStart = startOfHour(parseISO(date));

        if(isBefore(hourStart, new Date())){
            res.status(400).json({ error: "Past dates are not permitted" });
        }
        
        // check if Date to Appoitment is available
        const checkDataAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            }
        });

        if(checkDataAvailability){
            res.status(400).json({ error: "Date is not available!" });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });
        
        // Notify provider 
        console.log('User Id '+ req.userId);
        const userData = await User.findByPk(req.userId);

        console.log(userData);

        const formattedData = format(
            hourStart,
            "'dia' dd 'de' MMMM 'de' yyyy ', às ' H:mm'hr'",
            {locale: pt}
        );
        
        await Notification.create({
            content: `Novo agendamento de ${userData.name} para ${formattedData} `, 
            user: provider_id,
        });

        return res.json(appointment);

    }

    async delete(req, res){

        const appointment = await Appointment.findByPk(req.params.id , {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id','name','email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name']
                }
            ],
        });
        
        if(appointment.user_id != req.userId) {
            return res.status(401).json({
                error: "You can´t cancel this appointment. ",
            });

        }

        const dateWithSub = subHours( appointment.date, 2)

        if(isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                error: 'You only cancel appointments 2 hour in advance. ',
            }); 
        }

        appointment.canceled_at = new Date();

        await appointment.save();

        await Queue.add(CancellationMail.key, {
            appointment,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController;