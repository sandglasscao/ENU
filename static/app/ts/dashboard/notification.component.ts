import {Component} from '@angular/core';

import {NotificationService}  from './notification.service';
import {Notification}  from './notification';


@Component({
    selector: 'notify',
    templateUrl: 'static/app/templates/dashboard/notification.html',
    directives: [],
    providers: [
        NotificationService,
    ]
})
export class NotificationComponent {
    notifications: Notification[];
    selected: Notification;
    error: any;

    constructor(private notificationService: NotificationService) {
    }

    delItem(note: Notification) {
        this.selected = null;
        this.notificationService
            .delNote(note.id)
            .then(res => this.notifications = res.ok ? this.notifications.filter(item => item.id != note.id) : this.notifications)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.listNotifications();
    }

    detail(item: Notification) {
        this.selected = item;
        this.setRead(this.selected);
    }

    private listNotifications() {
        this.notificationService
            .listNotifications()
            .then(res => this.notifications = res)
            .catch(error => this.error = error);
    }

    private setRead(item: Notification) {
        if (item.status) return;
        this.notificationService
            .updateNote(item.id, {'status': true})
            .then(res => {
                this.selected.status = res.status;
                for (var i in this.notifications) {
                    this.notifications[i].status = (this.notifications[i].id == res.id) ? res.status : this.notifications[i].status;
                }
            })
            .catch(error => this.error = error);

    }
}