import { ConflictError, NotFoundError, ApplicationError } from "./index";

export function prismaErrorHandler(error: any): ApplicationError {
    const code = error.code;
    const meta = error.meta;
    
    switch (code) {
        case 'P2002':
            {
                const target = meta?.target;
                const field = Array.isArray(target) ? target.join(', ') : target || 'field';
                return new ConflictError(`${field} already exists`, 'DUPLICATE_ENTRY');
            }
        case 'P2025':
            {
                return new NotFoundError('Record Not Found', 'NOT_FOUND');
            }
        case 'P2003':
            {
                const field = meta?.field_name || 'relation';
                return new ConflictError(`Invalid reference: ${field}`, 'FOREIGN_KEY_VIOLATION');
            }
        default:
            {
                return new ApplicationError(error.message, error.code);
            }
    }
}
