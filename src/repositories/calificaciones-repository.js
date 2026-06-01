import Db from './db-pg.js';

export default class CalificacionesRepository {

    constructor() {
        console.log('Estoy en: CalificacionesRepository.constructor()');
        this.db = new Db();
    }

    getAllAsync = async () => {
        const sql = `
            SELECT
                c.id,
                c.id_alumno,
                a.nombre AS nombre_alumno,
                a.apellido AS apellido_alumno,
                c.id_materia,
                m.nombre AS nombre_materia,
                c.nota,
                c.fecha
            FROM calificaciones c
            INNER JOIN alumnos a ON a.id = c.id_alumno
            INNER JOIN materias m ON m.id = c.id_materia
        `;

        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        const sql = `
            SELECT
                c.id,
                c.id_alumno,
                a.nombre AS nombre_alumno,
                a.apellido AS apellido_alumno,
                c.id_materia,
                m.nombre AS nombre_materia,
                c.nota,
                c.fecha
            FROM calificaciones c
            INNER JOIN alumnos a ON a.id = c.id_alumno
            INNER JOIN materias m ON m.id = c.id_materia
            WHERE c.id = $1
        `;

        return await this.db.queryOne(sql, [id]);
    }

    getByAlumnoAsync = async (idAlumno) => {
        const sql = `
            SELECT
                c.id,
                c.id_materia,
                m.nombre AS nombre_materia,
                c.nota,
                c.fecha
            FROM calificaciones c
            INNER JOIN materias m ON m.id = c.id_materia
            WHERE c.id_alumno = $1
        `;

        return await this.db.queryAll(sql, [idAlumno]);
    }

    getByAlumnoMateriaAsync = async (idAlumno, idMateria) => {
        const sql = `
            SELECT *
            FROM calificaciones
            WHERE id_alumno = $1
            AND id_materia = $2
        `;

        return await this.db.queryOne(sql, [idAlumno, idMateria]);
    }

    createAsync = async (entity) => {
        const sql = `
            INSERT INTO calificaciones
            (
                id_alumno,
                id_materia,
                nota,
                fecha
            )
            VALUES
            (
                $1,
                $2,
                $3,
                COALESCE($4, CURRENT_DATE)
            )
            RETURNING id
        `;

        const values = [
            entity.id_alumno,
            entity.id_materia,
            entity.nota,
            entity.fecha ?? null
        ];

        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (id, entity) => {

        const actual = await this.getByIdAsync(id);

        if (!actual) return 0;

        const sql = `
            UPDATE calificaciones
            SET
                nota = $2,
                fecha = $3
            WHERE id = $1
        `;

        const values = [
            id,
            entity.nota ?? actual.nota,
            entity.fecha ?? actual.fecha
        ];

        return await this.db.queryRowCount(sql, values);
    }

    deleteByIdAsync = async (id) => {
        const sql = `
            DELETE FROM calificaciones
            WHERE id = $1
        `;

        return await this.db.queryRowCount(sql, [id]);
    }
}