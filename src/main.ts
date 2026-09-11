import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

function requestLog(request: HttpRequest<unknown>, next: HttpHandlerFn) {

    console.log("intercepted request " + request.url);
    let updateRequest = request.headers.set('HTTP-DEB', 'Testing');
    return next(request).pipe(
        tap(next => {
            if (next.type === HttpEventType.Response) {
                console.log("response " + next.status);
            }
        })
    );
}

bootstrapApplication(AppComponent, { providers: [provideHttpClient(withInterceptors([requestLog]))] }).catch((err) => console.error(err));
