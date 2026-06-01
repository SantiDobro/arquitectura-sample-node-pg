import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

export default class CalificacionesService {

    constructor() {
        console.log('Estoy en: CalificacionesService.constructor()');

        this.CalificacionesRepository = new CalificacionesRepository();
        this.AlumnosService = new AlumnosService();
        this.MateriasService = new MateriasService();
    }

    getAllAsync = async () => {
        return await this.CalificacionesRepository.getAllAsync();
    }

    getByIdAsync = async (id) => {
        return await this.CalificacionesRepository.getByIdAsync(id);
    }

    getByAlumnoAsync = async (idAlumno) => {

        const alumno = await this.AlumnosService.getByIdAsync(idAlumno);

        if (!alumno) {
            throw new Error(`El alumno con id ${idAlumno} no existe.`);
        }

        return await this.CalificacionesRepository.getByAlumnoAsync(idAlumno);
    }

    createAsync = async (entity) => {

        if (
            entity.nota == null ||
            !Number.isInteger(entity.nota) ||
            entity.nota < 0 ||
            entity.nota > 10
        ) {
            throw new Error('La nota debe ser un número entero entre 0 y 10.');
        }

        const alumno = await this.AlumnosService.getByIdAsync(entity.id_alumno);

        if (!alumno) {
            throw new Error(`El alumno con id ${entity.id_alumno} no existe.`);
        }

        const materia = await this.MateriasService.getByIdAsync(entity.id_materia);

        if (!materia) {
            throw new Error(`La materia con id ${entity.id_materia} no existe.`);
        }

        const existente =
            await this.CalificacionesRepository.getByAlumnoMateriaAsync(
                entity.id_alumno,
                entity.id_materia
            );

        if (existente) {
            throw new Error(
                `Ya existe una calificación para el alumno ${entity.id_alumno} en la materia ${entity.id_materia}.`
            );
        }

        return await this.CalificacionesRepository.createAsync(entity);
    }

    updateAsync = async (id, entity) => {

        const actual = await this.CalificacionesRepository.getByIdAsync(id);

        if (!actual) {
            throw new Error(`No se encontró la calificación (id: ${id}).`);
        }

        if (entity.nota != null) {

            if (
                !Number.isInteger(entity.nota) ||
                entity.nota < 0 ||
                entity.nota > 10
            ) {
                throw new Error('La nota debe ser un número entero entre 0 y 10.');
            }
        }

        return await this.CalificacionesRepository.updateAsync(id, entity);
    }

    deleteByIdAsync = async (id) => {
        return await this.CalificacionesRepository.deleteByIdAsync(id);
    }
}