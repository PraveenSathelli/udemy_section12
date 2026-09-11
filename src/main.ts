import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

function requestLog(request: HttpRequest<unknown>, next: HttpHandlerFn) {

    console.log("intercepted request " + request.url);
    let updateRequest = request.headers.set('HTTP-DEB', 'Testing');
    return next(request);
}

bootstrapApplication(AppComponent, { providers: [provideHttpClient(withInterceptors([requestLog]))] }).catch((err) => console.error(err));
