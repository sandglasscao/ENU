import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {MetadataService} from '../metadata/metadata.service';
import {Pquestion} from './pquestion'
import {PquestionService}  from './pquestion.service';
import {User} from '../user';
import {UserService}  from '../user.service';

@Component({
    templateUrl: 'static/app/templates/dashboard/password.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        MetadataService,
        PquestionService,
        UserService,
    ]
})
export class PasswordComponent implements OnInit {
    model = new User();
    qmodel = new Pquestion();
    questions: Pquestion[];
    securityQs = [];
    isPasswordChanged = false;
    isPasswd2 = true;
    error = null;

    constructor(private metadataService: MetadataService,
                private questionService: PquestionService,
                private router: Router,
                private userService: UserService) {
    }

    checkPassword2(pwd) {
        console.log(pwd);
        if (pwd != this.model.password) {
            this.isPasswd2 = false;
        }
    }

    deletePQ(question) {
        if (question.id)
        this.questionService
            .delQuestion(question.id)
            .then(res => this.questions = res.ok ? this.questions.filter(item => item.id != question.id) : this.questions)
            .catch(error => this.error = error);
        else
            this.questions = this.questions.filter(item => item.question != question.question);
    }

    editPQ(question) {
        this.qmodel = question;
    }

    ngOnInit() {
        this.listSecurityQuesitons();
        this.questionService
            .listQuestions()
            .then(questions => {
                this.questions = questions;
            })
            .catch(error => this.error = error); // TODO: Display error message

    }

    onSubmit() {
        this.userService
            .changePassword(this.model)
            .then(user => {
                // this.model = user
                this.isPasswordChanged = true;
                // console.log('change password '+user.password)
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    removePwdAlert() {
        this.isPasswd2 = true;
    }

    saveQuestion() {
        let question = this.questions.filter(qs => qs.question == this.qmodel.question)[0];
        if (question)
            this.questionService
                .updateQuestion(question)
                .then(qs => this.qmodel = qs)
                .catch(error => this.error = error);
        else
            this.questionService
                .addQuestion(this.qmodel)
                .then(question => this.questions.push(this.qmodel))
                .catch(error => this.error = error);
    }


    private  listSecurityQuesitons() {
        this.metadataService
            .listSecurityQuestion()
            .then(sqs => this.securityQs = sqs)
            .catch(error => this.error = error);
    }
}