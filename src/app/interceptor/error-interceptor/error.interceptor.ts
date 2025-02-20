import { HttpInterceptorFn } from '@angular/common/http';
import { NotifyService } from '../../services/notify-services/notify.service';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifyService = inject(NotifyService);

  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 0:
          notifyService.networkError();
          break;
        case 400:
          notifyService.badRequestError();
          break;
        case 401:
          // notifyService.unauthorizedError();
          break;
        case 402:
          notifyService.paymentRequiredError();
          break;
        case 403:
          notifyService.forbiddenError();
          break;
        case 404:
          notifyService.resourceNotFoundError();
          break;
        case 405:
          notifyService.methodNotAllowedError();
          break;
        case 406:
          notifyService.notAcceptableError();
          break;
        case 407:
          notifyService.proxyAuthRequiredError();
          break;
        case 408:
          notifyService.requestTimeoutError();
          break;
        case 409:
          notifyService.conflictError();
          break;
        case 410:
          notifyService.goneError();
          break;
        case 411:
          notifyService.lengthRequiredError();
          break;
        case 412:
          notifyService.preconditionFailedError();
          break;
        case 413:
          notifyService.payloadTooLargeError();
          break;
        case 414:
          notifyService.uriTooLongError();
          break;
        case 415:
          notifyService.unsupportedMediaTypeError();
          break;
        case 416:
          notifyService.rangeNotSatisfiableError();
          break;
        case 417:
          notifyService.expectationFailedError();
          break;
        case 418:
          notifyService.imATeapotError();
          break;
        case 421:
          notifyService.misdirectedRequestError();
          break;
        case 422:
          notifyService.unprocessableEntityError();
          break;
        case 423:
          notifyService.lockedError();
          break;
        case 424:
          notifyService.failedDependencyError();
          break;
        case 426:
          notifyService.upgradeRequiredError();
          break;
        case 428:
          notifyService.preconditionRequiredError();
          break;
        case 429:
          notifyService.tooManyRequestsError();
          break;
        case 431:
          notifyService.requestHeaderFieldsTooLargeError();
          break;
        case 451:
          notifyService.unavailableForLegalReasonsError();
          break;
        case 500:
          notifyService.internalServerError();
          break;
        case 501:
          notifyService.notImplementedError();
          break;
        case 502:
          notifyService.badGatewayError();
          break;
        case 503:
          notifyService.serviceUnavailableError();
          break;
        case 504:
          notifyService.gatewayTimeoutError();
          break;
        case 505:
          notifyService.httpVersionNotSupportedError();
          break;
        case 506:
          notifyService.variantAlsoNegotiatesError();
          break;
        case 507:
          notifyService.insufficientStorageError();
          break;
        case 508:
          notifyService.loopDetectedError();
          break;
        case 510:
          notifyService.notExtendedError();
          break;
        case 511:
          notifyService.networkAuthRequiredError();
          break;
        default:
          notifyService.defaultError();
          break;
      }
      return throwError(error);
    })
  );
};

