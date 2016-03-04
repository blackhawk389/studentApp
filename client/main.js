System.register(['angular2/core', 'angular2/common', 'angular2/platform/browser', 'angular2/http'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, browser_1, http_1, core_2;
    var child, parent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            child = (function () {
                function child() {
                    //because it was clicked into child component
                    this.editmode = false;
                    //initializing event
                    this.deleteEvent = new core_2.EventEmitter();
                    this.updateEvent = new core_2.EventEmitter();
                }
                child.prototype.deleteinfo = function (id) {
                    //sending data with emits
                    this.deleteEvent.emit(id);
                };
                child.prototype.saveinfo = function (recordobj) {
                    this.editmode = false;
                    this.updateEvent.emit(recordobj);
                };
                child.prototype.updateinfo = function () {
                    this.editmode = true;
                };
                child = __decorate([
                    core_1.Component({
                        selector: 'child',
                        template: "\n    \n    <span *ngIf = '!editmode'>{{record.name}}</span><input *ngIf = 'editmode' [(ngModel)]=\"record.name\"/>\n    <span>{{record.fname}}</span><input *ngIf = 'editmode' [(ngModel)]=\"record.fname\"/>\n    <span>{{record.age}}</span><input *ngIf = 'editmode' [(ngModel)]=\"record.age\"/>\n    <span>{{record.class}}</span><input *ngIf = 'editmode' [(ngModel)]=\"record.class\"/>\n    <span>{{record.email}}</span><input *ngIf = 'editmode' [(ngModel)]=\"record.email\"/>\n    <span>{{record.stnumber}}</span><input *ngIf = 'editmode' [(ngModel)]=\"record.stnumber\"/>\n    <button (click) = \"deleteinfo(record._id)\">Delete</button>\n    <button (click) = \"updateinfo()\">Update</button>\n    <button *ngIf = 'editmode' (click) = \"saveinfo(record)\">Save</button>\n    \n    ",
                        inputs: ['record'],
                        outputs: ['deleteEvent', 'updateEvent']
                    }), 
                    __metadata('design:paramtypes', [])
                ], child);
                return child;
            })();
            exports_1("child", child);
            parent = (function () {
                //avaliable to this class
                function parent(fb, http) {
                    this.http = http;
                    this.record = [];
                    this.form1 = fb.group({
                        'name': ['', common_1.Validators.required],
                        'fname': ['', common_1.Validators.required],
                        //custom validation
                        'age': ['', common_1.Validators.compose([common_1.Validators.required, this.customValidation])],
                        'class': ['', common_1.Validators.compose([common_1.Validators.required, this.customValidation])],
                        'email': ['', common_1.Validators.compose([common_1.Validators.required, this.emailvalidation])],
                        'stnumber': ['', common_1.Validators.compose([common_1.Validators.required, this.customValidation])]
                    });
                    //binding each controller
                    this.age = this.form1.controls['age'];
                    this.name = this.form1.controls['name'];
                    this.fname = this.form1.controls['fname'];
                    this.class = this.form1.controls['class'];
                    this.email = this.form1.controls['email'];
                    this.stnumber = this.form1.controls['stnumber'];
                }
                parent.prototype.customValidation = function (input) {
                    if (input.value.match(/^[0-9]+$/)) {
                        console.log('inside matched');
                        return { inval: true };
                    }
                    else {
                        console.log('not allowed');
                    }
                };
                parent.prototype.emailvalidation = function (input) {
                    var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                    if (input.value && !emailRegexp.test(input.value)) {
                        console.log('not allowed');
                    }
                    else {
                        console.log('allowed');
                        return { inval: true };
                    }
                };
                parent.prototype.onSubmit = function (value) {
                    var _this = this;
                    //gotta do this
                    var header = new http_1.Headers();
                    header.append('Content-Type', 'application/json');
                    var requestOption = new http_1.RequestOptions();
                    requestOption.headers = header;
                    //convert into reactive paradigm
                    this.http.post('http://localhost:3000/addstudent', JSON.stringify(value), requestOption)
                        .subscribe(function (res) {
                        console.log(res.json());
                        _this.record = res.json();
                    });
                    //how clear
                };
                parent.prototype.deletefromserver = function (id) {
                    var _this = this;
                    this.http.delete("http://localhost:3000/deleteinformation/" + id).subscribe(function (res) {
                        console.log(res.json());
                        _this.record = res.json();
                    });
                };
                parent.prototype.updatetoserver = function (studentobject) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    var opts = new http_1.RequestOptions();
                    opts.headers = headers;
                    this.http.post('http://localhost:3000/editinfo', JSON.stringify(studentobject), opts).subscribe(function (res) {
                        console.log(res.json());
                    });
                };
                parent = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "\n     <h3> Student Management</h3>\n     <form [ngFormModel] = 'form1'  (ngSubmit) = 'onSubmit(form1.value)'>\n     <input type = 'text' [ngFormControl] = 'name' (ngModel) = 'name'/>\n     <input type = 'text' [ngFormControl] = 'fname' (ngModel) = 'fname'/>\n     <input type = 'text' [ngFormControl] = 'age' (ngModel) = 'age'/>\n     <input type = 'text' [ngFormControl] = 'class' (ngModel) = 'class'/>\n     <input type = 'text' [ngFormControl] = 'email' (ngModel) = 'email'/>\n     <input type = 'text' [ngFormControl] = 'stnumber' (ngModel) = 'stnumber'/>\n     \n     <button type = 'submit' [disabled] = '!form1.valid'>Submit</button>\n     </form>\n     <div>\n     <child *ngFor = \"#r of record\" [record] = \"r\" (deleteEvent)=\"deletefromserver($event)\" (updateEvent) = \"updatetoserver($event)\">Dont Worry</child><div>\n    \n    ",
                        directives: [common_1.FORM_DIRECTIVES, child]
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http])
                ], parent);
                return parent;
            })();
            exports_1("parent", parent);
            browser_1.bootstrap(parent, [http_1.HTTP_PROVIDERS]);
        }
    }
});
//# sourceMappingURL=main.js.map