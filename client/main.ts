import { Component } from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators, AbstractControl, Control} from 'angular2/common';
import { bootstrap } from 'angular2/platform/browser';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions, Http, HTTP_PROVIDERS, Response} from  'angular2/http';
import { EventEmitter } from 'angular2/core';
@Component({

    selector: 'child',
    template: `
    
    <span *ngIf = '!editmode'>{{record.name}}</span><input *ngIf = 'editmode' [(ngModel)]="record.name"/>
    <span>{{record.fname}}</span><input *ngIf = 'editmode' [(ngModel)]="record.fname"/>
    <span>{{record.age}}</span><input *ngIf = 'editmode' [(ngModel)]="record.age"/>
    <span>{{record.class}}</span><input *ngIf = 'editmode' [(ngModel)]="record.class"/>
    <span>{{record.email}}</span><input *ngIf = 'editmode' [(ngModel)]="record.email"/>
    <span>{{record.stnumber}}</span><input *ngIf = 'editmode' [(ngModel)]="record.stnumber"/>
    <button (click) = "deleteinfo(record._id)">Delete</button>
    <button (click) = "updateinfo()">Update</button>
    <button *ngIf = 'editmode' (click) = "saveinfo(record)">Save</button>
    
    `,
    inputs : ['record'],
    outputs : ['deleteEvent' , 'updateEvent']


})
export class child { 
    
    //because it was clicked into child component
    editmode = false;
    deleteEvent : EventEmitter<any>;
    updateEvent : EventEmitter<any>;
    
    constructor(){
        
        //initializing event
        this.deleteEvent = new EventEmitter();
        this.updateEvent = new EventEmitter();
    }
    
    deleteinfo(id){
        //sending data with emits
        this.deleteEvent.emit(id);
    }
    saveinfo(recordobj){
        this.editmode = false;
        this.updateEvent.emit(recordobj);
    }
    updateinfo(){
        this.editmode = true;
    }
    
}

@Component({

    selector: 'parent',
    template: `
     <h3> Student Management</h3>
     <form [ngFormModel] = 'form1'  (ngSubmit) = 'onSubmit(form1.value)'>
     <input type = 'text' [ngFormControl] = 'name' (ngModel) = 'name'/>
     <input type = 'text' [ngFormControl] = 'fname' (ngModel) = 'fname'/>
     <input type = 'text' [ngFormControl] = 'age' (ngModel) = 'age'/>
     <input type = 'text' [ngFormControl] = 'class' (ngModel) = 'class'/>
     <input type = 'text' [ngFormControl] = 'email' (ngModel) = 'email'/>
     <input type = 'text' [ngFormControl] = 'stnumber' (ngModel) = 'stnumber'/>
     
     <button type = 'submit' [disabled] = '!form1.valid'>Submit</button>
     </form>
     <div>
     <child *ngFor = "#r of record" [record] = "r" (deleteEvent)="deletefromserver($event)" (updateEvent) = "updatetoserver($event)">Dont Worry</child><div>
    
    `,
    directives: [FORM_DIRECTIVES, child]

})
export class parent {

    form1: ControlGroup;
    //creating fields to send to child using input
    //can we make object of all these properties and send at once
    name: AbstractControl;
    age: AbstractControl;
    class: AbstractControl;
    email: AbstractControl;
    stnumber: AbstractControl;
    fname: AbstractControl;
    
    record : any[];
    //avaliable to this class
    constructor(fb: FormBuilder,private http : Http) {
        
        this.record = [];
        
        this.form1 = fb.group({
            'name': ['', Validators.required],
            'fname': ['', Validators.required],
            //custom validation
            'age': ['', Validators.compose([Validators.required, this.customValidation])],
            'class': ['', Validators.compose([Validators.required, this.customValidation])],
            'email': ['', Validators.compose([Validators.required, this.emailvalidation])],
            'stnumber': ['', Validators.compose([Validators.required, this.customValidation])]
        })
        
        //binding each controller
        
        this.age = this.form1.controls['age']
        this.name = this.form1.controls['name']
        this.fname = this.form1.controls['fname']
        this.class = this.form1.controls['class']
        this.email = this.form1.controls['email']
        this.stnumber = this.form1.controls['stnumber']
    }

    customValidation(input: Control) {
        if (input.value.match(/^[0-9]+$/)) {
            console.log('inside matched')
            return { inval: true };
        }
        else {
            console.log('not allowed')
        }
    }

    emailvalidation(input: Control) {
        var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        
        if (input.value && !emailRegexp.test(input.value)) {
            console.log('not allowed')
        } 
        else {
            console.log('allowed');
            return { inval: true }
        }
    }
    
    
    

    onSubmit(value: any) {
        
        //gotta do this
       var header : Headers = new Headers();
        header.append('Content-Type', 'application/json');
        var requestOption : RequestOptions = new RequestOptions();
        
        requestOption.headers = header;
        
        //convert into reactive paradigm
        this.http.post('http://localhost:3000/addstudent', JSON.stringify(value), requestOption)
                 .subscribe((res : Response) =>{
                     console.log(res.json());
                           this.record = res.json();
        }) 
        
        //how clear
       
    }
    
    deletefromserver(id){
        this.http.delete("http://localhost:3000/deleteinformation/" +id).subscribe((res : Response) => {
            console.log(res.json());
            this.record = res.json();
        }) 
    }
    updatetoserver(studentobject){
        
        let headers: Headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        
        this.http.post('http://localhost:3000/editinfo' ,JSON.stringify(studentobject), opts).subscribe(
           (res :Response)=>{
               console.log(res.json())
           });
    }   
}

bootstrap(parent, [HTTP_PROVIDERS]);