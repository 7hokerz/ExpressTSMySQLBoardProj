import { PoolConnection } from 'mysql2/promise';

export default class DAOFactory {
    private constructor(private readonly connection: PoolConnection) {}

    public static getInstance(connection: PoolConnection): DAOFactory {
        return new DAOFactory(connection);
    }

    public getDAO<T>(
        daoclass: new (connection: PoolConnection) => T
    ):T {
        return new daoclass(this.connection);
    }
}