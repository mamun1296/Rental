import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class NotifyService {  
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}  

 // NotifyService (handleApiResponseError method)
handleApiResponseError(error: any) {
  let errorMessage = 'An unexpected error occurred. Please try again.';  // Default message

  // Check for Unauthorized (401) error and handle specific cases
  if (error.status === 401) {
    if (error.error?.message === 'Invalid Email.') {
      errorMessage = 'Invalid email. Please check your email address.';
    } else if (error.error?.message === 'Invalid Password.') {
      errorMessage = 'Invalid password. Please try again.';
    } else {
      errorMessage = 'Login failed. Please try again.';
    }
  }

  // Handle other error status codes (if necessary)
  else if (error.status === 400) {
    errorMessage = 'Bad request. Please check your input and try again.';
  } else if (error.status === 500) {
    errorMessage = 'Server error. Please try again later.';
  }

  // Show the error message using NotifyService
  this.showMessage('error', errorMessage);
}

// showMessage method (unchanged)
showMessage(type: 'success' | 'error' | 'info' | 'warning', message: string) {
  const config: MatSnackBarConfig = {
    duration: 3000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
  };

  // Set custom styles based on the message type
  switch (type) {
    case 'success':
      config.panelClass = ['snackbar-success'];
      break;
    case 'error':
      config.panelClass = ['snackbar-error'];
      break;
    case 'info':
      config.panelClass = ['snackbar-info'];
      break;
    case 'warning':
      config.panelClass = ['snackbar-warning'];
      break;
    default:
      config.panelClass = ['snackbar-default'];
  }

  // Open the Snackbar with the message
  this.openSnackBar(message, 'Dismiss', config);
}

// openSnackBar method (unchanged)

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    const defaultConfig: MatSnackBarConfig = {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    };

    const snackBarConfig: MatSnackBarConfig = { ...defaultConfig, ...config };

    this.snackBar.open(message, action, snackBarConfig);
  }

showErrorMessage(errorMessage: string) {
  const action = 'Dismiss';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'end'
  };
  this.openSnackBar(errorMessage, action, config);
}


showThankYouMessage(message: string) {
  const config: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'center',
    duration: 3000  
  };
  this.openSnackBar(message, 'undefined', config);
}


showSuccessMessage(errorMessage: string) {
  const action = 'OK';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'right'
  };
  this.openSnackBar(errorMessage, action, config);
}






networkError() {
  this.showErrorMessage('Unable to connect to the server. Please check your internet connection.');
}

badRequestError(){
  this.showErrorMessage('Invalid request. Please check your request parameters.');
}

unauthorizedError() {
  this.showErrorMessage('Invalid credentials. Please check your username and password.');
}

forbiddenError(){
  this.showErrorMessage('Access forbidden for this resource.');
}

resourceNotFoundError(){
  this.showErrorMessage('Resource not found.');
}

internalServerError() {
  this.showErrorMessage('An internal server issue occurred. Please try again later.');
}

methodNotAllowedError() {
  this.showErrorMessage('Method not allowed for this resource.');
}

notAcceptableError() {
  this.showErrorMessage('Requested resource format not acceptable.');
}

paymentRequiredError() {
  this.showErrorMessage('Payment required to access this resource.');
}

proxyAuthRequiredError() {
  this.showErrorMessage('Proxy authentication required.');
}

requestTimeoutError() {
  this.showErrorMessage('Request timed out.');
}

conflictError() {
  this.showErrorMessage('Conflict with current resource state.');
}

goneError() {
  this.showErrorMessage('Requested resource no longer available.');
}

lengthRequiredError() {
  this.showErrorMessage('Request length not specified.');
}

preconditionFailedError() {
  this.showErrorMessage('Server precondition not met.');
}

payloadTooLargeError() {
  this.showErrorMessage('Request payload too large.');
}

uriTooLongError() {
  this.showErrorMessage('URI provided is too long.');
}

unsupportedMediaTypeError() {
  this.showErrorMessage('Unsupported media type.');
}

rangeNotSatisfiableError() {
  this.showErrorMessage('Requested range not satisfiable.');
}

expectationFailedError() {
  this.showErrorMessage('Expectation in request header not met.');
}

imATeapotError() {
  this.showErrorMessage('Server cannot brew coffee because it is a teapot.');
}

misdirectedRequestError() {
  this.showErrorMessage('Server unable to respond to this request.');
}

unprocessableEntityError() {
  this.showErrorMessage('Unable to process request entity.');
}

lockedError() {
  this.showErrorMessage('Requested resource is locked.');
}

failedDependencyError() {
  this.showErrorMessage('Request action depends on another action.');
}

upgradeRequiredError() {
  this.showErrorMessage('Secure request required by server.');
}

preconditionRequiredError() {
  this.showErrorMessage('Precondition required for this request.');
}

tooManyRequestsError() {
  this.showErrorMessage('Too many requests sent in a short time.');
}

requestHeaderFieldsTooLargeError() {
  this.showErrorMessage('Request header fields too large.');
}

unavailableForLegalReasonsError() {
  this.showErrorMessage('Resource not available due to legal reasons.');
}

notImplementedError() {
  this.showErrorMessage('Functionality not supported by server.');
}

badGatewayError() {
  this.showErrorMessage('Invalid response from upstream server.');
}

serviceUnavailableError() {
  this.showErrorMessage('Server currently unable to handle request.');
}

gatewayTimeoutError() {
  this.showErrorMessage('Gateway timeout occurred.');
}

httpVersionNotSupportedError() {
  this.showErrorMessage('HTTP protocol version not supported.');
}

variantAlsoNegotiatesError() {
  this.showErrorMessage('Server variant resource configuration error.');
}

insufficientStorageError() {
  this.showErrorMessage('Server unable to store required representation.');
}

loopDetectedError() {
  this.showErrorMessage('Server encountered an infinite loop.');
}

notExtendedError() {
  this.showErrorMessage('Further extensions required for request.');
}

networkAuthRequiredError() {
  this.showErrorMessage('Authentication required for requested response.');
}





handleApiError(error: any) {
  switch (error.status) {
    case 0:
      this.networkError();
      break;
    case 400:
      this.badRequestError();
      break;
    case 401:
      this.unauthorizedError();
      break;
    case 402:
      this.paymentRequiredError();
      break;
    case 403:
      this.forbiddenError();
      break;
    case 404:
      this.resourceNotFoundError();
      break;
    case 405:
      this.methodNotAllowedError();
      break;
    case 406:
      this.notAcceptableError();
      break;
    case 407:
      this.proxyAuthRequiredError();
      break;
    case 408:
      this.requestTimeoutError();
      break;
    case 409:
      this.conflictError();
      break;
    case 410:
      this.goneError();
      break;
    case 411:
      this.lengthRequiredError();
      break;
    case 412:
      this.preconditionFailedError();
      break;
    case 413:
      this.payloadTooLargeError();
      break;
    case 414:
      this.uriTooLongError();
      break;
    case 415:
      this.unsupportedMediaTypeError();
      break;
    case 416:
      this.rangeNotSatisfiableError();
      break;
    case 417:
      this.expectationFailedError();
      break;
    case 418:
      this.imATeapotError();
      break;
    case 421:
      this.misdirectedRequestError();
      break;
    case 422:
      this.unprocessableEntityError();
      break;
    case 423:
      this.lockedError();
      break;
    case 424:
      this.failedDependencyError();
      break;
    case 426:
      this.upgradeRequiredError();
      break;
    case 428:
      this.preconditionRequiredError();
      break;
    case 429:
      this.tooManyRequestsError();
      break;
    case 431:
      this.requestHeaderFieldsTooLargeError();
      break;
    case 451:
      this.unavailableForLegalReasonsError();
      break;
    case 500:
      this.internalServerError();
      break;
    case 501:
      this.notImplementedError();
      break;
    case 502:
      this.badGatewayError();
      break;
    case 503:
      this.serviceUnavailableError();
      break;
    case 504:
      this.gatewayTimeoutError();
      break;
    case 505:
      this.httpVersionNotSupportedError();
      break;
    case 506:
      this.variantAlsoNegotiatesError();
      break;
    case 507:
      this.insufficientStorageError();
      break;
    case 508:
      this.loopDetectedError();
      break;
    case 510:
      this.notExtendedError();
      break;
    case 511:
      this.networkAuthRequiredError();
      break;
    default:
      this.defaultError();
      break;
  }
}




fetchingError() {
  this.showErrorMessage('An error occurred while fetching information. Please try again.');
}

validationError(){
  this.showErrorMessage('Validation Error');
}

defaultError() {
  this.showErrorMessage('An error occurred. Please try again.');
}

insertSuccess() {
  const errorMessage = 'Added Successfully';
  const action = 'Dismiss';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top', 
    horizontalPosition: 'end',
    duration:2000    
  };
  this.openSnackBar(errorMessage, action, config);
}

updateSuccess() {
  const errorMessage = 'Update Successfully';
  const action = 'Dismiss';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top', 
    horizontalPosition: 'end',
    duration:2000  
  };
  this.openSnackBar(errorMessage, action, config);
}

DeleteSuccess() {
  const errorMessage = 'Delete Successfully';
  const action = 'Dismiss';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top', 
    horizontalPosition: 'end',
    duration:2000  
  };
  this.openSnackBar(errorMessage, action, config);
}


ProcessSuccess() {
  const errorMessage = 'Process Successfully';
  const action = 'Dismiss';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top', 
    horizontalPosition: 'end',
    duration:2000  
  };
  this.openSnackBar(errorMessage, action, config);
}


FileUploadSuccess() {
  const errorMessage = 'Process Successfully';
  const action = 'Dismiss';
  const config: MatSnackBarConfig = {
    verticalPosition: 'top', 
    horizontalPosition: 'end',
    duration:2000  
  };
  this.openSnackBar(errorMessage, action, config);
}



  handleError(err: any) {   
    if (err.error && err.error.message) {
      this.showErrorMessage(err.error.message);
    } else {
      this.showErrorMessage(err);
    }
  }

}
