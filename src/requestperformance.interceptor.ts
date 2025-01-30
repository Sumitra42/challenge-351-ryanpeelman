import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class RequestPerformanceInterceptor implements NestInterceptor {

  private readonly logger = new Logger(RequestPerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const label = `${context.getClass().name}.${context.getHandler().name}`;

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    console.time(label);

    this.logger.log(`Incoming Request: ${method} ${url}`);
    
    return next.handle().pipe(
      tap(() => {
          const duration = Date.now() - start;
          this.logger.log(`Completed Request: ${method} ${url} - ${duration}ms`);
          console.timeEnd(label);
      }),
      catchError((err) => {
          this.logger.error(
              `Error in ${method} ${url}: ${err.message}`,
              err.stack
          );
          throw err;
      }),
  );
  }
}
