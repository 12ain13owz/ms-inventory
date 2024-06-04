import {
  ErrorFieldComponent,
  SharedModule,
  ValidationService
} from "./chunk-6UWJ54NM.js";
import {
  AuthApiService,
  BehaviorSubject,
  Component,
  CoreModule,
  DefaultValueAccessor,
  Directive,
  ElementRef,
  EventEmitter,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  HostBinding,
  HostListener,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  MatButton,
  MatError,
  MatFormField,
  MatIcon,
  MatInput,
  MatLabel,
  MatProgressBar,
  MatRipple,
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
  MatSuffix,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgControlStatusGroup,
  NgModule,
  NgZone,
  Optional,
  Output,
  PLATFORM_ID,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
  Subject,
  Subscription,
  ToastNotificationService,
  TokenService,
  Validators,
  catchError,
  concatMap,
  environment,
  filter,
  finalize,
  forwardRef,
  inject,
  isPlatformBrowser,
  of,
  setClassMetadata,
  ɵNgNoValidate,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-5XPFCMCB.js";
import "./chunk-LBFFV6FE.js";
import {
  __spreadValues
} from "./chunk-CPNXOV62.js";

// src/app/modules/auth/auth.component.ts
var _AuthComponent = class _AuthComponent {
};
_AuthComponent.\u0275fac = function AuthComponent_Factory(t) {
  return new (t || _AuthComponent)();
};
_AuthComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuthComponent, selectors: [["app-auth"]], decls: 3, vars: 0, consts: [[1, "view"], [1, "rgba-stylish-strong"]], template: function AuthComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "div", 1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "router-outlet");
  }
}, dependencies: [RouterOutlet], styles: ["\n\n.view[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: url(/assets/images/bg-bsru.png) no-repeat center;\n  background-size: cover;\n  z-index: -100;\n}\n.rgba-stylish-strong[_ngcontent-%COMP%] {\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(62, 69, 81, 0.6);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n/*# sourceMappingURL=auth.component.css.map */"] });
var AuthComponent = _AuthComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuthComponent, { className: "AuthComponent", filePath: "src\\app\\modules\\auth\\auth.component.ts", lineNumber: 8 });
})();

// src/app/modules/auth/constants/forgot-password.constant.ts
var FORGOT_PASSWORD = {
  patternPassword: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  validationField: {
    email: {
      required: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 E-mail",
      email: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 E-mail \u0E43\u0E2B\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (example@gmail.com)"
    },
    passwordResetCode: {
      required: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 \u0E23\u0E2B\u0E31\u0E2A\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19",
      length: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A 8 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23"
    },
    newPassword: {
      required: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 New password",
      pattern: "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E15\u0E31\u0E27\u0E40\u0E25\u0E47\u0E01, \u0E15\u0E31\u0E27\u0E43\u0E2B\u0E0D\u0E48, \u0E15\u0E31\u0E27\u0E40\u0E25\u0E02, \u0E2D\u0E31\u0E01\u0E29\u0E23\u0E1E\u0E34\u0E40\u0E28\u0E29 \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 8 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23"
    },
    confirmPassword: {
      required: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 Confirm password",
      match: "Password \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19"
    }
  }
};

// src/app/modules/auth/components/forgot-password/forgot-password.component.ts
var _c0 = ["stepper"];
function ForgotPasswordComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 3);
  }
}
function ForgotPasswordComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, "E-mail");
  }
}
function ForgotPasswordComponent_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, "\u0E23\u0E2B\u0E31\u0E2A\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19");
  }
}
function ForgotPasswordComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.validationField.passwordResetCode.length);
  }
}
function ForgotPasswordComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275element(1, "app-error-field", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("control", ctx_r1.passwordResetCode)("errorMessage", ctx_r1.validationField.passwordResetCode);
  }
}
function ForgotPasswordComponent_ng_template_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, "\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19");
  }
}
var _ForgotPasswordComponent = class _ForgotPasswordComponent {
  constructor() {
    this.formBuilder = inject(FormBuilder);
    this.authApiService = inject(AuthApiService);
    this.validationService = inject(ValidationService);
    this.toastService = inject(ToastNotificationService);
    this.validationField = FORGOT_PASSWORD.validationField;
    this.patternPassword = FORGOT_PASSWORD.patternPassword;
    this.isLoading = false;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
    this.formEmail = this.initFormEmail();
    this.formVerified = this.initFormVerified();
    this.formResetPassword = this.initFormResetPassword();
  }
  onSubmitEmail() {
    if (this.formEmail.invalid)
      return;
    const email = this.formEmail.getRawValue().email;
    this.isLoading = true;
    this.authApiService.forgetPassword(email).pipe(finalize(() => this.isLoading = false)).subscribe((res) => {
      this.id = res.id;
      this.stepper.next();
    });
  }
  onSubmitVerified() {
    if (this.formVerified.invalid)
      return;
    this.stepper.next();
  }
  onSubmitResetPassword() {
    if (this.formResetPassword.invalid)
      return;
    const payload = {
      passwordResetCode: this.formVerified.getRawValue().passwordResetCode,
      newPassword: this.formResetPassword.getRawValue().newPassword,
      confirmPassword: this.formResetPassword.getRawValue().confirmPassword
    };
    this.isLoading = true;
    this.authApiService.resetPassword(this.id, payload).pipe(concatMap((res) => {
      this.toastService.success("Success", res.message);
      return this.authApiService.logout().pipe(catchError(() => of(null)));
    }), finalize(() => this.isLoading = false)).subscribe();
  }
  get email() {
    return this.formEmail.controls["email"];
  }
  get passwordResetCode() {
    return this.formVerified.controls["passwordResetCode"];
  }
  get newPassword() {
    return this.formResetPassword.controls["newPassword"];
  }
  get confirmPassword() {
    return this.formResetPassword.controls["confirmPassword"];
  }
  initFormEmail() {
    return this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }
  initFormVerified() {
    return this.formBuilder.nonNullable.group({
      passwordResetCode: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)]
      ]
    });
  }
  initFormResetPassword() {
    return this.formBuilder.nonNullable.group({
      newPassword: [
        "",
        [Validators.required, Validators.pattern(this.patternPassword)]
      ],
      confirmPassword: [""]
    }, {
      validators: this.validationService.comparePassword.bind(this, [
        "newPassword",
        "confirmPassword"
      ])
    });
  }
};
_ForgotPasswordComponent.\u0275fac = function ForgotPasswordComponent_Factory(t) {
  return new (t || _ForgotPasswordComponent)();
};
_ForgotPasswordComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotPasswordComponent, selectors: [["app-forgot-password"]], viewQuery: function ForgotPasswordComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c0, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.stepper = _t.first);
  }
}, decls: 63, vars: 22, consts: [["stepper", ""], [1, "forgot-wrapper"], [1, "forgot-box", "dark-theme"], ["mode", "indeterminate"], ["src", "assets/images/logo-bsru.png", "alt", "logo"], [2, "margin-inline", "-24px"], ["labelPosition", "bottom", "linear", "true"], [3, "stepControl"], [3, "ngSubmit", "formGroup"], ["matStepLabel", ""], ["matInput", "", "type", "email", "formControlName", "email"], ["matSuffix", "", "fontIcon", "email"], [3, "control", "errorMessage"], ["type", "submit", "mat-button", "", 3, "disabled"], [3, "stepControl", "editable", "optional"], [3, "formGroup"], ["matInput", "", "type", "text", "formControlName", "passwordResetCode"], ["mat-button", "", "matStepperPrevious", ""], ["mat-button", "", "matStepperNext", ""], [3, "editable", "optional"], ["matInput", "", "formControlName", "newPassword", "autocomplete", "off", 3, "type"], ["matSuffix", "", 3, "click"], ["matInput", "", "formControlName", "confirmPassword", "autocomplete", "off", 3, "type"], ["type", "submit", "mat-button", ""], [1, "login"], ["routerLink", "/login"]], template: function ForgotPasswordComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
    \u0275\u0275template(2, ForgotPasswordComponent_Conditional_2_Template, 1, 0, "mat-progress-bar", 3);
    \u0275\u0275element(3, "img", 4);
    \u0275\u0275elementStart(4, "h1");
    \u0275\u0275text(5, "\u0E25\u0E37\u0E21\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19 ?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 5)(7, "mat-stepper", 6, 0)(9, "mat-step", 7)(10, "form", 8);
    \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_Template_form_ngSubmit_10_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.onSubmitEmail());
    });
    \u0275\u0275template(11, ForgotPasswordComponent_ng_template_11_Template, 1, 0, "ng-template", 9);
    \u0275\u0275elementStart(12, "mat-form-field")(13, "mat-label");
    \u0275\u0275text(14, "E-mail");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 10)(16, "mat-icon", 11);
    \u0275\u0275elementStart(17, "mat-error");
    \u0275\u0275element(18, "app-error-field", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div")(20, "button", 13);
    \u0275\u0275text(21, " \u0E16\u0E31\u0E14\u0E44\u0E1B ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "mat-step", 14)(23, "form", 15);
    \u0275\u0275template(24, ForgotPasswordComponent_ng_template_24_Template, 1, 0, "ng-template", 9);
    \u0275\u0275elementStart(25, "mat-form-field")(26, "mat-label");
    \u0275\u0275text(27, "\u0E23\u0E2B\u0E31\u0E2A\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 16);
    \u0275\u0275template(29, ForgotPasswordComponent_Conditional_29_Template, 2, 1, "mat-error")(30, ForgotPasswordComponent_Conditional_30_Template, 2, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div")(32, "button", 17);
    \u0275\u0275text(33, "\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "button", 18);
    \u0275\u0275text(35, "\u0E16\u0E31\u0E14\u0E44\u0E1B");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(36, "mat-step", 19)(37, "form", 8);
    \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_Template_form_ngSubmit_37_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.onSubmitResetPassword());
    });
    \u0275\u0275template(38, ForgotPasswordComponent_ng_template_38_Template, 1, 0, "ng-template", 9);
    \u0275\u0275elementStart(39, "mat-form-field")(40, "mat-label");
    \u0275\u0275text(41, "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E43\u0E2B\u0E21\u0E48");
    \u0275\u0275elementEnd();
    \u0275\u0275element(42, "input", 20);
    \u0275\u0275elementStart(43, "mat-icon", 21);
    \u0275\u0275listener("click", function ForgotPasswordComponent_Template_mat_icon_click_43_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.hideNewPassword = !ctx.hideNewPassword);
    });
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "mat-error");
    \u0275\u0275element(46, "app-error-field", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "mat-form-field")(48, "mat-label");
    \u0275\u0275text(49, "\u0E22\u0E34\u0E19\u0E22\u0E31\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E43\u0E2B\u0E21\u0E48");
    \u0275\u0275elementEnd();
    \u0275\u0275element(50, "input", 22);
    \u0275\u0275elementStart(51, "mat-icon", 21);
    \u0275\u0275listener("click", function ForgotPasswordComponent_Template_mat_icon_click_51_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.hideConfirmPassword = !ctx.hideConfirmPassword);
    });
    \u0275\u0275text(52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "mat-error");
    \u0275\u0275element(54, "app-error-field", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div")(56, "button", 17);
    \u0275\u0275text(57, "\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 23);
    \u0275\u0275text(59, "\u0E15\u0E01\u0E25\u0E07");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(60, "div", 24)(61, "a", 25);
    \u0275\u0275text(62, "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, ctx.isLoading ? 2 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275property("stepControl", ctx.formEmail);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx.formEmail);
    \u0275\u0275advance(8);
    \u0275\u0275property("control", ctx.email)("errorMessage", ctx.validationField.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.isLoading);
    \u0275\u0275advance(2);
    \u0275\u0275property("stepControl", ctx.formVerified)("editable", true)("optional", false);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx.formVerified);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(29, ctx.passwordResetCode.value.length != 0 && ctx.passwordResetCode.value.length != 8 && ctx.passwordResetCode.touched ? 29 : 30);
    \u0275\u0275advance(7);
    \u0275\u0275property("editable", false)("optional", false);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx.formResetPassword);
    \u0275\u0275advance(5);
    \u0275\u0275property("type", ctx.hideNewPassword ? "password" : "text");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.hideNewPassword ? "visibility_off" : "visibility");
    \u0275\u0275advance(2);
    \u0275\u0275property("control", ctx.newPassword)("errorMessage", ctx.validationField.newPassword);
    \u0275\u0275advance(4);
    \u0275\u0275property("type", ctx.hideConfirmPassword ? "password" : "text");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.hideConfirmPassword ? "visibility_off" : "visibility");
    \u0275\u0275advance(2);
    \u0275\u0275property("control", ctx.confirmPassword)("errorMessage", ctx.validationField.confirmPassword);
  }
}, dependencies: [RouterLink, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatButton, MatIcon, MatInput, MatFormField, MatLabel, MatError, MatSuffix, MatProgressBar, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, ErrorFieldComponent], styles: ["\n\n.forgot-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100dvh;\n  width: 100dvw;\n  padding: 0 30px;\n  box-sizing: border-box;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n  width: 100%;\n  max-width: 400px;\n  padding: 40px 60px;\n  background: rgba(0, 0, 0, 0.7);\n  border-radius: 6px;\n  box-shadow: 5px 10px 20px #4e3515;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -150px;\n  left: calc(50% - 60px);\n  width: 120px;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin-top: 0;\n  letter-spacing: 1px;\n  color: #f54831;\n  font-weight: bold;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  border-radius: 6px;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 10px;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.9);\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   mat-stepper[_ngcontent-%COMP%] {\n  background: transparent;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   .login[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 1rem;\n  text-align: right;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   .login[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  transition: color 0.3s;\n}\n.forgot-wrapper[_ngcontent-%COMP%]   .forgot-box[_ngcontent-%COMP%]   .login[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #ff5722;\n}\n.complete[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  padding: 10px;\n  width: 80px;\n  height: 80px;\n  font-size: 80px;\n  border-radius: 50%;\n  border: 5px solid #1cbd32;\n}\n.complete[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  color: #fff;\n  font-size: 20px;\n}\n/*# sourceMappingURL=forgot-password.component.css.map */"] });
var ForgotPasswordComponent = _ForgotPasswordComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "src\\app\\modules\\auth\\components\\forgot-password\\forgot-password.component.ts", lineNumber: 16 });
})();

// src/app/modules/auth/guards/auth.guard.ts
var authGuard = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();
  if (!accessToken || accessToken === "undefined" || accessToken === "null")
    return true;
  router.navigate(["/"]);
  return false;
};

// node_modules/ng-recaptcha/fesm2022/ng-recaptcha.mjs
var RECAPTCHA_LANGUAGE = new InjectionToken("recaptcha-language");
var RECAPTCHA_BASE_URL = new InjectionToken("recaptcha-base-url");
var RECAPTCHA_NONCE = new InjectionToken("recaptcha-nonce-tag");
var RECAPTCHA_SETTINGS = new InjectionToken("recaptcha-settings");
var RECAPTCHA_V3_SITE_KEY = new InjectionToken("recaptcha-v3-site-key");
var RECAPTCHA_LOADER_OPTIONS = new InjectionToken("recaptcha-loader-options");
function loadScript(renderMode, onBeforeLoad, onLoaded, {
  url,
  lang,
  nonce
} = {}) {
  window.ng2recaptchaloaded = () => {
    onLoaded(grecaptcha);
  };
  const script = document.createElement("script");
  script.innerHTML = "";
  const {
    url: baseUrl,
    nonce: onBeforeLoadNonce
  } = onBeforeLoad(new URL(url || "https://www.google.com/recaptcha/api.js"));
  baseUrl.searchParams.set("render", renderMode === "explicit" ? renderMode : renderMode.key);
  baseUrl.searchParams.set("onload", "ng2recaptchaloaded");
  baseUrl.searchParams.set("trustedtypes", "true");
  if (lang) {
    baseUrl.searchParams.set("hl", lang);
  }
  script.src = baseUrl.href;
  const nonceValue = onBeforeLoadNonce || nonce;
  if (nonceValue) {
    script.setAttribute("nonce", nonceValue);
  }
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
function newLoadScript({
  v3SiteKey,
  onBeforeLoad,
  onLoaded
}) {
  const renderMode = v3SiteKey ? {
    key: v3SiteKey
  } : "explicit";
  loader.loadScript(renderMode, onBeforeLoad, onLoaded);
}
var loader = {
  loadScript,
  newLoadScript
};
function toNonNullObservable(subject) {
  return subject.asObservable().pipe(filter((value) => value !== null));
}
var _RecaptchaLoaderService = class _RecaptchaLoaderService {
  constructor(platformId, language, baseUrl, nonce, v3SiteKey, options) {
    this.platformId = platformId;
    this.language = language;
    this.baseUrl = baseUrl;
    this.nonce = nonce;
    this.v3SiteKey = v3SiteKey;
    this.options = options;
    const subject = this.init();
    this.ready = subject ? toNonNullObservable(subject) : of();
  }
  /** @internal */
  init() {
    if (_RecaptchaLoaderService.ready) {
      return _RecaptchaLoaderService.ready;
    }
    if (!isPlatformBrowser(this.platformId)) {
      return void 0;
    }
    const subject = new BehaviorSubject(null);
    _RecaptchaLoaderService.ready = subject;
    loader.newLoadScript({
      v3SiteKey: this.v3SiteKey,
      onBeforeLoad: (url) => {
        if (this.options?.onBeforeLoad) {
          return this.options.onBeforeLoad(url);
        }
        const newUrl = new URL(this.baseUrl ?? url);
        if (this.language) {
          newUrl.searchParams.set("hl", this.language);
        }
        return {
          url: newUrl,
          nonce: this.nonce
        };
      },
      onLoaded: (recaptcha) => {
        let value = recaptcha;
        if (this.options?.onLoaded) {
          value = this.options.onLoaded(recaptcha);
        }
        subject.next(value);
      }
    });
    return subject;
  }
};
_RecaptchaLoaderService.ready = null;
_RecaptchaLoaderService.\u0275fac = function RecaptchaLoaderService_Factory(t) {
  return new (t || _RecaptchaLoaderService)(\u0275\u0275inject(PLATFORM_ID), \u0275\u0275inject(RECAPTCHA_LANGUAGE, 8), \u0275\u0275inject(RECAPTCHA_BASE_URL, 8), \u0275\u0275inject(RECAPTCHA_NONCE, 8), \u0275\u0275inject(RECAPTCHA_V3_SITE_KEY, 8), \u0275\u0275inject(RECAPTCHA_LOADER_OPTIONS, 8));
};
_RecaptchaLoaderService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _RecaptchaLoaderService,
  factory: _RecaptchaLoaderService.\u0275fac
});
var RecaptchaLoaderService = _RecaptchaLoaderService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaLoaderService, [{
    type: Injectable
  }], () => [{
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RECAPTCHA_LANGUAGE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RECAPTCHA_BASE_URL]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RECAPTCHA_NONCE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RECAPTCHA_V3_SITE_KEY]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RECAPTCHA_LOADER_OPTIONS]
    }]
  }], null);
})();
var nextId = 0;
var _RecaptchaComponent = class _RecaptchaComponent {
  constructor(elementRef, loader2, zone, settings) {
    this.elementRef = elementRef;
    this.loader = loader2;
    this.zone = zone;
    this.id = `ngrecaptcha-${nextId++}`;
    this.errorMode = "default";
    this.resolved = new EventEmitter();
    this.error = new EventEmitter();
    this.errored = new EventEmitter();
    if (settings) {
      this.siteKey = settings.siteKey;
      this.theme = settings.theme;
      this.type = settings.type;
      this.size = settings.size;
      this.badge = settings.badge;
    }
  }
  ngAfterViewInit() {
    this.subscription = this.loader.ready.subscribe((grecaptcha2) => {
      if (grecaptcha2 != null && grecaptcha2.render instanceof Function) {
        this.grecaptcha = grecaptcha2;
        this.renderRecaptcha();
      }
    });
  }
  ngOnDestroy() {
    this.grecaptchaReset();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /**
   * Executes the invisible recaptcha.
   * Does nothing if component's size is not set to "invisible".
   */
  execute() {
    if (this.size !== "invisible") {
      return;
    }
    if (this.widget != null) {
      void this.grecaptcha.execute(this.widget);
    } else {
      this.executeRequested = true;
    }
  }
  reset() {
    if (this.widget != null) {
      if (this.grecaptcha.getResponse(this.widget)) {
        this.resolved.emit(null);
      }
      this.grecaptchaReset();
    }
  }
  /**
   * ⚠️ Warning! Use this property at your own risk!
   *
   * While this member is `public`, it is not a part of the component's public API.
   * The semantic versioning guarantees _will not be honored_! Thus, you might find that this property behavior changes in incompatible ways in minor or even patch releases.
   * You are **strongly advised** against using this property.
   * Instead, use more idiomatic ways to get reCAPTCHA value, such as `resolved` EventEmitter, or form-bound methods (ngModel, formControl, and the likes).å
   */
  get __unsafe_widgetValue() {
    return this.widget != null ? this.grecaptcha.getResponse(this.widget) : null;
  }
  /** @internal */
  expired() {
    this.resolved.emit(null);
  }
  /** @internal */
  onError(args) {
    this.error.emit(args);
    this.errored.emit(args);
  }
  /** @internal */
  captchaResponseCallback(response) {
    this.resolved.emit(response);
  }
  /** @internal */
  grecaptchaReset() {
    if (this.widget != null) {
      this.zone.runOutsideAngular(() => this.grecaptcha.reset(this.widget));
    }
  }
  /** @internal */
  renderRecaptcha() {
    const renderOptions = {
      badge: this.badge,
      callback: (response) => {
        this.zone.run(() => this.captchaResponseCallback(response));
      },
      "expired-callback": () => {
        this.zone.run(() => this.expired());
      },
      sitekey: this.siteKey,
      size: this.size,
      tabindex: this.tabIndex,
      theme: this.theme,
      type: this.type
    };
    if (this.errorMode === "handled") {
      renderOptions["error-callback"] = (...args) => {
        this.zone.run(() => this.onError(args));
      };
    }
    this.widget = this.grecaptcha.render(this.elementRef.nativeElement, renderOptions);
    if (this.executeRequested === true) {
      this.executeRequested = false;
      this.execute();
    }
  }
};
_RecaptchaComponent.\u0275fac = function RecaptchaComponent_Factory(t) {
  return new (t || _RecaptchaComponent)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(RecaptchaLoaderService), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(RECAPTCHA_SETTINGS, 8));
};
_RecaptchaComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _RecaptchaComponent,
  selectors: [["re-captcha"]],
  hostVars: 1,
  hostBindings: function RecaptchaComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("id", ctx.id);
    }
  },
  inputs: {
    id: "id",
    siteKey: "siteKey",
    theme: "theme",
    type: "type",
    size: "size",
    tabIndex: "tabIndex",
    badge: "badge",
    errorMode: "errorMode"
  },
  outputs: {
    resolved: "resolved",
    error: "error",
    errored: "errored"
  },
  exportAs: ["reCaptcha"],
  decls: 0,
  vars: 0,
  template: function RecaptchaComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var RecaptchaComponent = _RecaptchaComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaComponent, [{
    type: Component,
    args: [{
      exportAs: "reCaptcha",
      selector: "re-captcha",
      template: ``
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: RecaptchaLoaderService
  }, {
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RECAPTCHA_SETTINGS]
    }]
  }], {
    id: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.id"]
    }],
    siteKey: [{
      type: Input
    }],
    theme: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    tabIndex: [{
      type: Input
    }],
    badge: [{
      type: Input
    }],
    errorMode: [{
      type: Input
    }],
    resolved: [{
      type: Output
    }],
    error: [{
      type: Output
    }],
    errored: [{
      type: Output
    }]
  });
})();
var _RecaptchaCommonModule = class _RecaptchaCommonModule {
};
_RecaptchaCommonModule.\u0275fac = function RecaptchaCommonModule_Factory(t) {
  return new (t || _RecaptchaCommonModule)();
};
_RecaptchaCommonModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _RecaptchaCommonModule
});
_RecaptchaCommonModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var RecaptchaCommonModule = _RecaptchaCommonModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaCommonModule, [{
    type: NgModule,
    args: [{
      declarations: [RecaptchaComponent],
      exports: [RecaptchaComponent]
    }]
  }], null, null);
})();
var _RecaptchaModule = class _RecaptchaModule {
};
_RecaptchaModule.\u0275fac = function RecaptchaModule_Factory(t) {
  return new (t || _RecaptchaModule)();
};
_RecaptchaModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _RecaptchaModule
});
_RecaptchaModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  providers: [RecaptchaLoaderService],
  imports: [RecaptchaCommonModule]
});
var RecaptchaModule = _RecaptchaModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaModule, [{
    type: NgModule,
    args: [{
      exports: [RecaptchaComponent],
      imports: [RecaptchaCommonModule],
      providers: [RecaptchaLoaderService]
    }]
  }], null, null);
})();
var _ReCaptchaV3Service = class _ReCaptchaV3Service {
  constructor(zone, recaptchaLoader, siteKey2) {
    this.recaptchaLoader = recaptchaLoader;
    this.zone = zone;
    this.siteKey = siteKey2;
    this.init();
  }
  get onExecute() {
    if (!this.onExecuteSubject) {
      this.onExecuteSubject = new Subject();
      this.onExecuteObservable = this.onExecuteSubject.asObservable();
    }
    return this.onExecuteObservable;
  }
  get onExecuteError() {
    if (!this.onExecuteErrorSubject) {
      this.onExecuteErrorSubject = new Subject();
      this.onExecuteErrorObservable = this.onExecuteErrorSubject.asObservable();
    }
    return this.onExecuteErrorObservable;
  }
  /**
   * Executes the provided `action` with reCAPTCHA v3 API.
   * Use the emitted token value for verification purposes on the backend.
   *
   * For more information about reCAPTCHA v3 actions and tokens refer to the official documentation at
   * https://developers.google.com/recaptcha/docs/v3.
   *
   * @param {string} action the action to execute
   * @returns {Observable<string>} an `Observable` that will emit the reCAPTCHA v3 string `token` value whenever ready.
   * The returned `Observable` completes immediately after emitting a value.
   */
  execute(action) {
    const subject = new Subject();
    if (!this.grecaptcha) {
      if (!this.actionBacklog) {
        this.actionBacklog = [];
      }
      this.actionBacklog.push([action, subject]);
    } else {
      this.executeActionWithSubject(action, subject);
    }
    return subject.asObservable();
  }
  /** @internal */
  executeActionWithSubject(action, subject) {
    const onError = (error) => {
      this.zone.run(() => {
        subject.error(error);
        if (this.onExecuteErrorSubject) {
          this.onExecuteErrorSubject.next({
            action,
            error
          });
        }
      });
    };
    this.zone.runOutsideAngular(() => {
      try {
        this.grecaptcha.execute(this.siteKey, {
          action
        }).then((token) => {
          this.zone.run(() => {
            subject.next(token);
            subject.complete();
            if (this.onExecuteSubject) {
              this.onExecuteSubject.next({
                action,
                token
              });
            }
          });
        }, onError);
      } catch (e) {
        onError(e);
      }
    });
  }
  /** @internal */
  init() {
    this.recaptchaLoader.ready.subscribe((value) => {
      this.grecaptcha = value;
      if (this.actionBacklog && this.actionBacklog.length > 0) {
        this.actionBacklog.forEach(([action, subject]) => this.executeActionWithSubject(action, subject));
        this.actionBacklog = void 0;
      }
    });
  }
};
_ReCaptchaV3Service.\u0275fac = function ReCaptchaV3Service_Factory(t) {
  return new (t || _ReCaptchaV3Service)(\u0275\u0275inject(NgZone), \u0275\u0275inject(RecaptchaLoaderService), \u0275\u0275inject(RECAPTCHA_V3_SITE_KEY));
};
_ReCaptchaV3Service.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _ReCaptchaV3Service,
  factory: _ReCaptchaV3Service.\u0275fac
});
var ReCaptchaV3Service = _ReCaptchaV3Service;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReCaptchaV3Service, [{
    type: Injectable
  }], () => [{
    type: NgZone
  }, {
    type: RecaptchaLoaderService
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [RECAPTCHA_V3_SITE_KEY]
    }]
  }], null);
})();
var _RecaptchaV3Module = class _RecaptchaV3Module {
};
_RecaptchaV3Module.\u0275fac = function RecaptchaV3Module_Factory(t) {
  return new (t || _RecaptchaV3Module)();
};
_RecaptchaV3Module.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _RecaptchaV3Module
});
_RecaptchaV3Module.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  providers: [ReCaptchaV3Service, RecaptchaLoaderService]
});
var RecaptchaV3Module = _RecaptchaV3Module;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaV3Module, [{
    type: NgModule,
    args: [{
      providers: [ReCaptchaV3Service, RecaptchaLoaderService]
    }]
  }], null, null);
})();
var _RecaptchaValueAccessorDirective = class _RecaptchaValueAccessorDirective {
  constructor(host) {
    this.host = host;
    this.requiresControllerReset = false;
  }
  writeValue(value) {
    if (!value) {
      this.host.reset();
    } else {
      if (this.host.__unsafe_widgetValue !== value && Boolean(this.host.__unsafe_widgetValue) === false) {
        this.requiresControllerReset = true;
      }
    }
  }
  registerOnChange(fn) {
    this.onChange = fn;
    if (this.requiresControllerReset) {
      this.requiresControllerReset = false;
      this.onChange(null);
    }
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  onResolve($event) {
    if (this.onChange) {
      this.onChange($event);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }
};
_RecaptchaValueAccessorDirective.\u0275fac = function RecaptchaValueAccessorDirective_Factory(t) {
  return new (t || _RecaptchaValueAccessorDirective)(\u0275\u0275directiveInject(RecaptchaComponent));
};
_RecaptchaValueAccessorDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _RecaptchaValueAccessorDirective,
  selectors: [["re-captcha", "formControlName", ""], ["re-captcha", "formControl", ""], ["re-captcha", "ngModel", ""]],
  hostBindings: function RecaptchaValueAccessorDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resolved", function RecaptchaValueAccessorDirective_resolved_HostBindingHandler($event) {
        return ctx.onResolve($event);
      });
    }
  },
  features: [\u0275\u0275ProvidersFeature([{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => _RecaptchaValueAccessorDirective)
  }])]
});
var RecaptchaValueAccessorDirective = _RecaptchaValueAccessorDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaValueAccessorDirective, [{
    type: Directive,
    args: [{
      providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RecaptchaValueAccessorDirective)
      }],
      selector: "re-captcha[formControlName],re-captcha[formControl],re-captcha[ngModel]"
    }]
  }], () => [{
    type: RecaptchaComponent
  }], {
    onResolve: [{
      type: HostListener,
      args: ["resolved", ["$event"]]
    }]
  });
})();
var _RecaptchaFormsModule = class _RecaptchaFormsModule {
};
_RecaptchaFormsModule.\u0275fac = function RecaptchaFormsModule_Factory(t) {
  return new (t || _RecaptchaFormsModule)();
};
_RecaptchaFormsModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _RecaptchaFormsModule
});
_RecaptchaFormsModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [FormsModule, RecaptchaCommonModule]
});
var RecaptchaFormsModule = _RecaptchaFormsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecaptchaFormsModule, [{
    type: NgModule,
    args: [{
      declarations: [RecaptchaValueAccessorDirective],
      exports: [RecaptchaValueAccessorDirective],
      imports: [FormsModule, RecaptchaCommonModule]
    }]
  }], null, null);
})();

// src/app/modules/auth/constants/login.constant.ts
var LOGIN = {
  validationField: {
    email: {
      required: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 E-mail",
      email: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 E-mail \u0E43\u0E2B\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (example@gmail.com)"
    },
    password: {
      required: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 Password"
    }
  }
};

// src/app/modules/auth/components/login/login.component.ts
function LoginComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 2);
  }
}
var _LoginComponent = class _LoginComponent {
  constructor() {
    this.subscription = new Subscription();
    this.formBuilder = inject(FormBuilder);
    this.router = inject(Router);
    this.authApiService = inject(AuthApiService);
    this.recaptchaV3Service = inject(ReCaptchaV3Service);
    this.validationField = LOGIN.validationField;
    this.isLoading = false;
    this.hidePassword = true;
    this.form = this.initForm();
  }
  ngOnInit() {
    this.initForm();
    this.subscription = this.recaptchaV3Service.execute("importantAction").subscribe((token) => this.recaptcha.setValue(token));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onSubmit() {
    if (this.form.invalid)
      return;
    const payload = __spreadValues({}, this.form.getRawValue());
    this.isLoading = true;
    this.authApiService.login(payload).pipe(finalize(() => this.isLoading = false)).subscribe((res) => this.router.navigate(["/"]));
  }
  get email() {
    return this.form.controls["email"];
  }
  get password() {
    return this.form.controls["password"];
  }
  get recaptcha() {
    return this.form.controls["recaptcha"];
  }
  initForm() {
    return this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      recaptcha: ["", [Validators.required]]
    });
  }
};
_LoginComponent.\u0275fac = function LoginComponent_Factory(t) {
  return new (t || _LoginComponent)();
};
_LoginComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 27, vars: 9, consts: [[1, "login-wrapper"], [1, "dark-theme", 3, "ngSubmit", "formGroup"], ["mode", "indeterminate"], ["src", "assets/images/logo-bsru.png", "alt", "logo"], ["matInput", "", "type", "email", "formControlName", "email"], ["matSuffix", "", "fontIcon", "email"], [3, "control", "errorMessage"], ["matInput", "", "type", "password", "formControlName", "password", "autocomplete", "false", 3, "type"], ["matSuffix", "", 3, "click"], ["type", "submit", "matRipple", "", 3, "disabled"], [1, "text"], [1, "forgot-password"], ["routerLink", "./forgot-password"]], template: function LoginComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "form", 1);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_1_listener() {
      return ctx.onSubmit();
    });
    \u0275\u0275template(2, LoginComponent_Conditional_2_Template, 1, 0, "mat-progress-bar", 2);
    \u0275\u0275element(3, "img", 3);
    \u0275\u0275elementStart(4, "h1");
    \u0275\u0275text(5, "\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E25\u0E31\u0E07\u0E1E\u0E31\u0E2A\u0E14\u0E38");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "mat-form-field")(7, "mat-label");
    \u0275\u0275text(8, "E-mail");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 4)(10, "mat-icon", 5);
    \u0275\u0275elementStart(11, "mat-error");
    \u0275\u0275element(12, "app-error-field", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "mat-form-field")(14, "mat-label");
    \u0275\u0275text(15, "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "input", 7);
    \u0275\u0275elementStart(17, "mat-icon", 8);
    \u0275\u0275listener("click", function LoginComponent_Template_mat_icon_click_17_listener() {
      return ctx.hidePassword = !ctx.hidePassword;
    });
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "mat-error");
    \u0275\u0275element(20, "app-error-field", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 9)(22, "span", 10);
    \u0275\u0275text(23, "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 11)(25, "a", 12);
    \u0275\u0275text(26, "\u0E25\u0E37\u0E21\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19 ?");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx.isLoading ? 2 : -1);
    \u0275\u0275advance(10);
    \u0275\u0275property("control", ctx.email)("errorMessage", ctx.validationField.email);
    \u0275\u0275advance(4);
    \u0275\u0275property("type", ctx.hidePassword ? "password" : "text");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
    \u0275\u0275advance(2);
    \u0275\u0275property("control", ctx.password)("errorMessage", ctx.validationField.password);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.isLoading);
  }
}, dependencies: [RouterLink, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatIcon, MatInput, MatFormField, MatLabel, MatError, MatSuffix, MatProgressBar, MatRipple, ErrorFieldComponent], styles: ["\n\n.login-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100dvh;\n  width: 100dvw;\n  padding: 0 30px;\n  box-sizing: border-box;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n  width: 100%;\n  max-width: 400px;\n  padding: 40px 60px;\n  background: rgba(0, 0, 0, 0.7);\n  border-radius: 6px;\n  box-shadow: 5px 10px 20px #4e3515;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -150px;\n  left: calc(50% - 60px);\n  width: 120px;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin-top: 0;\n  letter-spacing: 1px;\n  color: #f54831;\n  font-weight: bold;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  border-radius: 6px;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.9);\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-top: 15px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-image:\n    linear-gradient(\n      144deg,\n      #823876,\n      #5b42f3 50%,\n      #009ee3);\n  background-image:\n    linear-gradient(\n      144deg,\n      #f54831,\n      #f17363 50%,\n      #ff9800);\n  border: none;\n  border-radius: 6px;\n  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;\n  color: #fff;\n  font-size: 1rem;\n  line-height: 1em;\n  width: 100%;\n  padding: 3px;\n  text-decoration: none;\n  -webkit-user-select: none;\n  user-select: none;\n  touch-action: manipulation;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background-color: rgba(5, 6, 45, 0.7);\n  padding: 16px 24px;\n  border-radius: 6px;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  font-weight: 600;\n  transition: 300ms;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:active, .login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover, .login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus {\n  outline: 0;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover:enabled   span[_ngcontent-%COMP%], .login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus:enabled   span[_ngcontent-%COMP%] {\n  background: none;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:active:enabled {\n  scale: 0.9;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  background-image: none;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled   span[_ngcontent-%COMP%] {\n  background-color: #ccc;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .forgot-password[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 1rem;\n  text-align: right;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .forgot-password[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  transition: color 0.3s;\n}\n.login-wrapper[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .forgot-password[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #ff5722;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
var LoginComponent = _LoginComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\modules\\auth\\components\\login\\login.component.ts", lineNumber: 15 });
})();

// src/app/modules/auth/auth.routes.ts
var routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      { path: "", component: LoginComponent, canActivate: [authGuard] },
      { path: "forgot-password", component: ForgotPasswordComponent }
    ]
  }
];
var _AuthRoutingModule = class _AuthRoutingModule {
};
_AuthRoutingModule.\u0275fac = function AuthRoutingModule_Factory(t) {
  return new (t || _AuthRoutingModule)();
};
_AuthRoutingModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AuthRoutingModule });
_AuthRoutingModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
var AuthRoutingModule = _AuthRoutingModule;

// src/app/modules/auth/auth.module.ts
var siteKey = environment.recaptcha.siteKey;
var provideRecaptcha = [
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: siteKey }
];
var _AuthModule = class _AuthModule {
};
_AuthModule.\u0275fac = function AuthModule_Factory(t) {
  return new (t || _AuthModule)();
};
_AuthModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AuthModule });
_AuthModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [provideRecaptcha], imports: [AuthRoutingModule, CoreModule, SharedModule, RecaptchaV3Module] });
var AuthModule = _AuthModule;
export {
  AuthModule
};
//# sourceMappingURL=chunk-TWAWN6UB.js.map
