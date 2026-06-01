import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import CalificacionesService from './../services/calificaciones-service.js';

const router = Router();
const currentService = new CalificacionesService();

router.get('', async (req, res) => {

    try {

        const data = await currentService.getAllAsync();

        res.status(StatusCodes.OK).json(data);

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/alumno/:idAlumno', async (req, res) => {

    try {

        const data =
            await currentService.getByAlumnoAsync(req.params.idAlumno);

        res.status(StatusCodes.OK).json(data);

    } catch (error) {

        res.status(StatusCodes.NOT_FOUND)
            .send(error.message);
    }
});

router.get('/:id', async (req, res) => {

    try {

        const data =
            await currentService.getByIdAsync(req.params.id);

        if (!data) {
            return res.status(StatusCodes.NOT_FOUND)
                .send(`No se encontró la calificación (id:${req.params.id}).`);
        }

        res.status(StatusCodes.OK).json(data);

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }
});

router.post('', async (req, res) => {

    try {

        const newId =
            await currentService.createAsync(req.body);

        res.status(StatusCodes.CREATED)
            .json(newId);

    } catch (error) {

        if (error.message.includes('Ya existe')) {

            return res.status(StatusCodes.CONFLICT)
                .json({ error: error.message });
        }

        res.status(StatusCodes.BAD_REQUEST)
            .json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {

    try {

        const rowsAffected =
            await currentService.updateAsync(
                req.params.id,
                req.body
            );

        if (rowsAffected === 0) {

            return res.status(StatusCodes.NOT_FOUND)
                .send(`No se encontró la calificación (id:${req.params.id}).`);
        }

        res.status(StatusCodes.OK)
            .json(rowsAffected);

    } catch (error) {

        if (error.message.includes('No se encontró')) {

            return res.status(StatusCodes.NOT_FOUND)
                .send(error.message);
        }

        res.status(StatusCodes.BAD_REQUEST)
            .send(error.message);
    }
});

router.delete('/:id', async (req, res) => {

    try {

        const rowsAffected =
            await currentService.deleteByIdAsync(req.params.id);

        if (rowsAffected === 0) {

            return res.status(StatusCodes.NOT_FOUND)
                .send(`No se encontró la calificación (id:${req.params.id}).`);
        }

        res.status(StatusCodes.OK).json(null);

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }
});

export default router;