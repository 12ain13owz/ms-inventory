import {
  BehaviorSubject,
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  CoreModule,
  DOCUMENT,
  FormGroupDirective,
  Inject,
  InjectionToken,
  Input,
  InputFlags,
  MatCard,
  MatCardContent,
  MatCardHeader,
  NgClass,
  NgControlStatusGroup,
  NgModule,
  NgStyle,
  Observable,
  Optional,
  Subscription,
  inject,
  input,
  isDevMode,
  of,
  output,
  setClassMetadata,
  ɵNgNoValidate,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵpureFunction5,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-5XPFCMCB.js";
import {
  require_sweetalert2_all
} from "./chunk-LBFFV6FE.js";
import {
  __spreadValues,
  __toESM
} from "./chunk-CPNXOV62.js";

// src/app/modules/shared/pipes/validation.pipe.ts
var _ValidationPipe = class _ValidationPipe {
  transform(value, errorObj) {
    return value[Object.keys(errorObj)[0]];
  }
};
_ValidationPipe.\u0275fac = function ValidationPipe_Factory(t) {
  return new (t || _ValidationPipe)();
};
_ValidationPipe.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "validation", type: _ValidationPipe, pure: true });
var ValidationPipe = _ValidationPipe;

// src/app/modules/shared/components/error-field/error-field.component.ts
function ErrorFieldComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "validation");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1("\n", \u0275\u0275pipeBind2(1, 1, ctx_r0.errorMessage, ctx_r0.control.errors), "\n");
  }
}
var _ErrorFieldComponent = class _ErrorFieldComponent {
  constructor() {
    this.formDirective = inject(FormGroupDirective);
  }
};
_ErrorFieldComponent.\u0275fac = function ErrorFieldComponent_Factory(t) {
  return new (t || _ErrorFieldComponent)();
};
_ErrorFieldComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ErrorFieldComponent, selectors: [["app-error-field"]], inputs: { control: "control", errorMessage: "errorMessage" }, decls: 1, vars: 1, template: function ErrorFieldComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ErrorFieldComponent_Conditional_0_Template, 2, 4);
  }
  if (rf & 2) {
    \u0275\u0275conditional(0, ctx.control.errors && (ctx.control.touched || ctx.formDirective.submitted) ? 0 : -1);
  }
}, dependencies: [ValidationPipe] });
var ErrorFieldComponent = _ErrorFieldComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ErrorFieldComponent, { className: "ErrorFieldComponent", filePath: "src\\app\\modules\\shared\\components\\error-field\\error-field.component.ts", lineNumber: 13 });
})();

// node_modules/ngx-skeleton-loader/fesm2022/ngx-skeleton-loader.mjs
var _c0 = ["*"];
var _c1 = (a0, a1, a2, a3, a4) => ({
  "custom-content": a0,
  circle: a1,
  progress: a2,
  "progress-dark": a3,
  pulse: a4
});
function NgxSkeletonLoaderComponent_For_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0);
  }
}
function NgxSkeletonLoaderComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275template(1, NgxSkeletonLoaderComponent_For_1_Conditional_1_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction5(5, _c1, ctx_r0.appearance === "custom-content", ctx_r0.appearance === "circle", ctx_r0.animation === "progress", ctx_r0.animation === "progress-dark", ctx_r0.animation === "pulse"))("ngStyle", ctx_r0.theme);
    \u0275\u0275attribute("aria-label", ctx_r0.ariaLabel)("aria-valuetext", ctx_r0.loadingText);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r0.appearance === "custom-content" ? 1 : -1);
  }
}
var NGX_SKELETON_LOADER_CONFIG = new InjectionToken("ngx-skeleton-loader.config");
var _NgxSkeletonLoaderComponent = class _NgxSkeletonLoaderComponent {
  constructor(config) {
    this.config = config;
    const {
      appearance = "line",
      animation = "progress",
      theme = null,
      loadingText = "Loading...",
      count = 1,
      ariaLabel = "loading"
    } = config || {};
    this.appearance = appearance;
    this.animation = animation;
    this.theme = theme;
    this.loadingText = loadingText;
    this.count = count;
    this.items = [];
    this.ariaLabel = ariaLabel;
  }
  ngOnInit() {
    this.validateInputValues();
  }
  validateInputValues() {
    if (!/^\d+$/.test(`${this.count}`)) {
      if (isDevMode()) {
        console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'count' a numeric value. Forcing default to "1".`);
      }
      this.count = 1;
    }
    if (this.appearance === "custom-content") {
      if (isDevMode() && this.count !== 1) {
        console.error(`\`NgxSkeletonLoaderComponent\` enforces elements with "custom-content" appearance as DOM nodes. Forcing "count" to "1".`);
        this.count = 1;
      }
    }
    this.items.length = this.count;
    const allowedAnimations = ["progress", "progress-dark", "pulse", "false"];
    if (allowedAnimations.indexOf(String(this.animation)) === -1) {
      if (isDevMode()) {
        console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'animation' as: ${allowedAnimations.join(", ")}. Forcing default to "progress".`);
      }
      this.animation = "progress";
    }
    if (["circle", "line", "custom-content", ""].indexOf(String(this.appearance)) === -1) {
      if (isDevMode()) {
        console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'appearance' as: circle or line or custom-content or empty string. Forcing default to "''".`);
      }
      this.appearance = "";
    }
    const {
      theme
    } = this.config || {};
    if (!!theme && !!theme.extendsFromRoot && this.theme !== null) {
      this.theme = __spreadValues(__spreadValues({}, this.config.theme), this.theme);
    }
  }
  ngOnChanges(changes) {
    if (["count", "animation", "appearance"].find((key) => changes[key] && (changes[key].isFirstChange() || changes[key].previousValue === changes[key].currentValue))) {
      return;
    }
    this.validateInputValues();
  }
};
_NgxSkeletonLoaderComponent.\u0275fac = function NgxSkeletonLoaderComponent_Factory(t) {
  return new (t || _NgxSkeletonLoaderComponent)(\u0275\u0275directiveInject(NGX_SKELETON_LOADER_CONFIG, 8));
};
_NgxSkeletonLoaderComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _NgxSkeletonLoaderComponent,
  selectors: [["ngx-skeleton-loader"]],
  inputs: {
    count: "count",
    loadingText: "loadingText",
    appearance: "appearance",
    animation: "animation",
    ariaLabel: "ariaLabel",
    theme: "theme"
  },
  features: [\u0275\u0275NgOnChangesFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 0,
  consts: [["aria-busy", "true", "aria-valuemin", "0", "aria-valuemax", "100", "role", "progressbar", "tabindex", "-1", 1, "skeleton-loader", 3, "ngClass", "ngStyle"]],
  template: function NgxSkeletonLoaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275repeaterCreate(0, NgxSkeletonLoaderComponent_For_1_Template, 2, 11, "div", 0, \u0275\u0275repeaterTrackByIdentity);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.items);
    }
  },
  dependencies: [NgClass, NgStyle],
  styles: ['.skeleton-loader[_ngcontent-%COMP%]{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader[_ngcontent-%COMP%]:after, .skeleton-loader[_ngcontent-%COMP%]:before{box-sizing:border-box}.skeleton-loader.circle[_ngcontent-%COMP%]{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress[_ngcontent-%COMP%], .skeleton-loader.progress-dark[_ngcontent-%COMP%]{transform:translateZ(0)}.skeleton-loader.progress[_ngcontent-%COMP%]:after, .skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:after, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{box-sizing:border-box}.skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{animation:_ngcontent-%COMP%_progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:""}.skeleton-loader.progress[_ngcontent-%COMP%]:before{background-image:linear-gradient(90deg,#fff0,#fff9,#fff0)}.skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation-delay:.5s}.skeleton-loader.custom-content[_ngcontent-%COMP%]{height:100%;background:none}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse[_ngcontent-%COMP%], .skeleton-loader.progress-dark[_ngcontent-%COMP%], .skeleton-loader.custom-content[_ngcontent-%COMP%], .skeleton-loader.progress[_ngcontent-%COMP%]:before{animation:none}.skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%], .skeleton-loader.custom-content[_ngcontent-%COMP%]{background-image:none}}@media screen and (min-device-width: 1200px){.skeleton-loader[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none;cursor:wait}}@keyframes _ngcontent-%COMP%_progress{0%{transform:translate3d(-200px,0,0)}to{transform:translate3d(calc(200px + 100vw),0,0)}}@keyframes _ngcontent-%COMP%_pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}'],
  changeDetection: 0
});
var NgxSkeletonLoaderComponent = _NgxSkeletonLoaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxSkeletonLoaderComponent, [{
    type: Component,
    args: [{
      selector: "ngx-skeleton-loader",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `@for (item of items; track item) {
  <div
    class="skeleton-loader"
    [attr.aria-label]="ariaLabel"
    aria-busy="true"
    aria-valuemin="0"
    aria-valuemax="100"
    [attr.aria-valuetext]="loadingText"
    role="progressbar"
    tabindex="-1"
    [ngClass]="{
      'custom-content': appearance === 'custom-content',
      circle: appearance === 'circle',
      progress: animation === 'progress',
      'progress-dark': animation === 'progress-dark',
      pulse: animation === 'pulse'
    }"
    [ngStyle]="theme"
    >
    @if (appearance  === 'custom-content') {
      <ng-content></ng-content>
    }
  </div>
}
`,
      styles: ['.skeleton-loader{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader:after,.skeleton-loader:before{box-sizing:border-box}.skeleton-loader.circle{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress,.skeleton-loader.progress-dark{transform:translateZ(0)}.skeleton-loader.progress:after,.skeleton-loader.progress:before,.skeleton-loader.progress-dark:after,.skeleton-loader.progress-dark:before{box-sizing:border-box}.skeleton-loader.progress:before,.skeleton-loader.progress-dark:before{animation:progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:""}.skeleton-loader.progress:before{background-image:linear-gradient(90deg,#fff0,#fff9,#fff0)}.skeleton-loader.progress-dark:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse{animation:pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation-delay:.5s}.skeleton-loader.custom-content{height:100%;background:none}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse,.skeleton-loader.progress-dark,.skeleton-loader.custom-content,.skeleton-loader.progress:before{animation:none}.skeleton-loader.progress:before,.skeleton-loader.progress-dark,.skeleton-loader.custom-content{background-image:none}}@media screen and (min-device-width: 1200px){.skeleton-loader{-webkit-user-select:none;user-select:none;cursor:wait}}@keyframes progress{0%{transform:translate3d(-200px,0,0)}to{transform:translate3d(calc(200px + 100vw),0,0)}}@keyframes pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}\n']
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [NGX_SKELETON_LOADER_CONFIG]
    }, {
      type: Optional
    }]
  }], {
    count: [{
      type: Input
    }],
    loadingText: [{
      type: Input
    }],
    appearance: [{
      type: Input
    }],
    animation: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    theme: [{
      type: Input
    }]
  });
})();
var _NgxSkeletonLoaderModule = class _NgxSkeletonLoaderModule {
  static forRoot(config) {
    return {
      ngModule: _NgxSkeletonLoaderModule,
      providers: [{
        provide: NGX_SKELETON_LOADER_CONFIG,
        useValue: config
      }]
    };
  }
};
_NgxSkeletonLoaderModule.\u0275fac = function NgxSkeletonLoaderModule_Factory(t) {
  return new (t || _NgxSkeletonLoaderModule)();
};
_NgxSkeletonLoaderModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _NgxSkeletonLoaderModule
});
_NgxSkeletonLoaderModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule]
});
var NgxSkeletonLoaderModule = _NgxSkeletonLoaderModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxSkeletonLoaderModule, [{
    type: NgModule,
    args: [{
      declarations: [NgxSkeletonLoaderComponent],
      imports: [CommonModule],
      exports: [NgxSkeletonLoaderComponent]
    }]
  }], null, null);
})();

// src/app/modules/shared/services/theme.service.ts
var _ThemeService = class _ThemeService {
  constructor() {
    this.document = inject(DOCUMENT);
    this.themeKey = "dark-theme";
    this.isDarkTheme = localStorage.getItem(this.themeKey) === "true" ? true : false;
    this.isDarkTheme$ = new BehaviorSubject(this.isDarkTheme);
    this.docTheme = this.document.documentElement.classList;
    this.onListener().subscribe((theme) => {
      if (theme) {
        this.docTheme.add(this.themeKey);
        localStorage.setItem(this.themeKey, theme.toString());
      } else {
        this.docTheme.remove(this.themeKey);
        localStorage.setItem(this.themeKey, theme.toString());
      }
    });
  }
  onListener() {
    return this.isDarkTheme$.asObservable();
  }
  getTheme() {
    return this.isDarkTheme;
  }
  setTheme(theme) {
    this.isDarkTheme = theme;
    this.isDarkTheme$.next(theme);
  }
};
_ThemeService.\u0275fac = function ThemeService_Factory(t) {
  return new (t || _ThemeService)();
};
_ThemeService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
var ThemeService = _ThemeService;

// src/app/modules/shared/components/loading-data/loading-data.component.ts
var _c02 = (a0, a1) => ({ height: a0, background: a1, width: "100px" });
var _c12 = (a0, a1) => ({ height: a0, background: a1, width: "100%" });
function LoadingDataComponent_Conditional_0_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ngx-skeleton-loader", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c12, ctx_r0.heigh, ctx_r0.backgroundColor));
  }
}
function LoadingDataComponent_Conditional_0_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ngx-skeleton-loader", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c12, ctx_r0.heigh, ctx_r0.backgroundColor));
  }
}
function LoadingDataComponent_Conditional_0_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ngx-skeleton-loader", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c02, ctx_r0.heigh, ctx_r0.backgroundColor));
  }
}
function LoadingDataComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card")(1, "mat-card-header");
    \u0275\u0275element(2, "ngx-skeleton-loader", 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "form")(4, "mat-card-content", 1);
    \u0275\u0275repeaterCreate(5, LoadingDataComponent_Conditional_0_For_6_Template, 1, 4, "ngx-skeleton-loader", 0, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(7, "div", 2);
    \u0275\u0275repeaterCreate(8, LoadingDataComponent_Conditional_0_For_9_Template, 1, 4, "ngx-skeleton-loader", 0, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "ngx-skeleton-loader", 0);
    \u0275\u0275elementStart(11, "div", 3);
    \u0275\u0275repeaterCreate(12, LoadingDataComponent_Conditional_0_For_13_Template, 1, 4, "ngx-skeleton-loader", 0, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(2, _c02, ctx_r0.heigh, ctx_r0.backgroundColor));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.onRepeat(2));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.onRepeat(2));
    \u0275\u0275advance(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(5, _c12, ctx_r0.heigh, ctx_r0.backgroundColor));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.onRepeat(2));
  }
}
function LoadingDataComponent_Conditional_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ngx-skeleton-loader", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c12, ctx_r0.heigh, ctx_r0.backgroundColor));
  }
}
function LoadingDataComponent_Conditional_1_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ngx-skeleton-loader", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c12, ctx_r0.heigh, ctx_r0.backgroundColor));
  }
}
function LoadingDataComponent_Conditional_1_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ngx-skeleton-loader", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c12, ctx_r0.heigh, ctx_r0.backgroundColor));
  }
}
function LoadingDataComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card")(1, "mat-card-header");
    \u0275\u0275element(2, "ngx-skeleton-loader", 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "form")(4, "mat-card-content", 1);
    \u0275\u0275repeaterCreate(5, LoadingDataComponent_Conditional_1_For_6_Template, 1, 4, "ngx-skeleton-loader", 0, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(7, "div", 4);
    \u0275\u0275repeaterCreate(8, LoadingDataComponent_Conditional_1_For_9_Template, 1, 4, "ngx-skeleton-loader", 0, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, LoadingDataComponent_Conditional_1_For_11_Template, 1, 4, "ngx-skeleton-loader", 0, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("theme", \u0275\u0275pureFunction2(1, _c02, ctx_r0.heigh, ctx_r0.backgroundColor));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.onRepeat(2));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.onRepeat(20));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.onRepeat(2));
  }
}
var _LoadingDataComponent = class _LoadingDataComponent {
  constructor() {
    this.heigh = "50px";
    this.form = "card";
    this.subscription = new Subscription();
    this.themeService = inject(ThemeService);
    this.backgroundColor = "#EFF1F5";
    this.repeatRowList = Array(20).fill(0);
  }
  ngOnInit() {
    this.subscription = this.themeService.onListener().subscribe((theme) => {
      if (theme)
        this.backgroundColor = "#323232";
      else
        this.backgroundColor = "#EFF1F5";
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onRepeat(no) {
    return Array(no).fill(0);
  }
};
_LoadingDataComponent.\u0275fac = function LoadingDataComponent_Factory(t) {
  return new (t || _LoadingDataComponent)();
};
_LoadingDataComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoadingDataComponent, selectors: [["app-loading-data"]], inputs: { heigh: "heigh", form: "form" }, decls: 2, vars: 1, consts: [["appearance", "line", 3, "theme"], [1, "loader-box"], [1, "loader-row"], [1, "loader-action"], [1, "loader-row-list"]], template: function LoadingDataComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, LoadingDataComponent_Conditional_0_Template, 14, 8, "mat-card")(1, LoadingDataComponent_Conditional_1_Template, 12, 4);
  }
  if (rf & 2) {
    \u0275\u0275conditional(0, ctx.form === "card" ? 0 : ctx.form === "list" ? 1 : -1);
  }
}, dependencies: [\u0275NgNoValidate, NgControlStatusGroup, MatCard, MatCardContent, MatCardHeader, NgxSkeletonLoaderComponent], styles: ["\n\n.loader-box[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.loader-box[_ngcontent-%COMP%]   .loader-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.loader-box[_ngcontent-%COMP%]   .loader-row-list[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  gap: 10px;\n}\n.loader-box[_ngcontent-%COMP%]   .loader-action[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 100px 100px;\n  gap: 10px;\n}\n/*# sourceMappingURL=loading-data.component.css.map */"] });
var LoadingDataComponent = _LoadingDataComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoadingDataComponent, { className: "LoadingDataComponent", filePath: "src\\app\\modules\\shared\\components\\loading-data\\loading-data.component.ts", lineNumber: 10 });
})();

// src/app/modules/shared/pipes/thai-year.pipe.ts
var _ThaiYearPipe = class _ThaiYearPipe {
  transform(value) {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month + 1}/${year + 543}`;
  }
};
_ThaiYearPipe.\u0275fac = function ThaiYearPipe_Factory(t) {
  return new (t || _ThaiYearPipe)();
};
_ThaiYearPipe.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "thaiYear", type: _ThaiYearPipe, pure: true });
var ThaiYearPipe = _ThaiYearPipe;

// src/app/modules/shared/pipes/to-array.pipe.ts
var _ToArrayPipe = class _ToArrayPipe {
  transform(value) {
    return Array.from({ length: value }, (_, index) => index + 1);
  }
};
_ToArrayPipe.\u0275fac = function ToArrayPipe_Factory(t) {
  return new (t || _ToArrayPipe)();
};
_ToArrayPipe.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "toArray", type: _ToArrayPipe, pure: true });
var ToArrayPipe = _ToArrayPipe;

// src/app/modules/shared/components/sweet-alert/sweet-alert.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());
var _SweetAlertComponent = class _SweetAlertComponent {
  constructor() {
    this.themeService = inject(ThemeService);
    this.icon = input();
    this.confirm = output();
  }
  ngOnInit() {
    this.themeService.onListener().subscribe((theme) => this.setTheme(theme));
  }
  alert(title) {
    this.title = this.color + title + "</span>";
    import_sweetalert2.default.fire({
      title: this.title,
      icon: this.icon(),
      showCancelButton: true,
      background: this.backgroundColor,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      confirmButtonText: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19",
      cancelButtonText: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"
    }).then((result) => {
      if (result.isConfirmed) {
        this.onConfirm();
        return;
      }
      this.onCancle();
    });
  }
  onConfirm() {
    this.confirm.emit(true);
  }
  onCancle() {
    this.confirm.emit(false);
  }
  setTheme(theme) {
    if (theme) {
      this.color = '<span style="color: #fff;">';
      this.backgroundColor = "#19191A";
      this.confirmButtonColor = "#645CCA";
      this.cancelButtonColor = "#636C74";
      return;
    }
    this.color = '<span style="color: #545454;">';
    this.backgroundColor = "#FFFFFF";
    this.confirmButtonColor = "#645CCA";
    this.cancelButtonColor = "#636C74";
  }
};
_SweetAlertComponent.\u0275fac = function SweetAlertComponent_Factory(t) {
  return new (t || _SweetAlertComponent)();
};
_SweetAlertComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SweetAlertComponent, selectors: [["app-sweet-alert"]], inputs: { icon: [InputFlags.SignalBased, "icon"] }, outputs: { confirm: "confirm" }, decls: 0, vars: 0, template: function SweetAlertComponent_Template(rf, ctx) {
} });
var SweetAlertComponent = _SweetAlertComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SweetAlertComponent, { className: "SweetAlertComponent", filePath: "src\\app\\modules\\shared\\components\\sweet-alert\\sweet-alert.component.ts", lineNumber: 14 });
})();

// src/app/modules/shared/shared.module.ts
var _SharedModule = class _SharedModule {
};
_SharedModule.\u0275fac = function SharedModule_Factory(t) {
  return new (t || _SharedModule)();
};
_SharedModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _SharedModule });
_SharedModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [CoreModule, NgxSkeletonLoaderModule] });
var SharedModule = _SharedModule;

// src/app/modules/shared/services/validation.service.ts
var _ValidationService = class _ValidationService {
  constructor() {
  }
  comparePassword(field, form) {
    const password = form.controls[field[0]];
    const confirmPassword = form.controls[field[1]];
    if (password.value === "" && confirmPassword.value === "") {
      confirmPassword.setErrors({ required: true });
      return { required: true };
    }
    if (password.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
      return null;
    }
    confirmPassword.setErrors({ match: true });
    return { match: true };
  }
  oneOf(allowedValues) {
    return (control) => {
      if (!allowedValues)
        return null;
      if (!control.value || allowedValues.includes(control.value))
        return null;
      else
        return { oneOf: true };
    };
  }
  isEmpty(data) {
    return !data || data.length === 0;
  }
  isDate() {
    return (control) => {
      const value = control.value;
      if (!value)
        return null;
      const isValidate = !isNaN(Date.parse(value));
      return isValidate ? null : { invalidDate: true };
    };
  }
  mimeType() {
    return (control) => {
      if (typeof control.value === "string")
        return of(null);
      const file = control.value;
      const fileReader = new FileReader();
      const file$ = new Observable((observer) => {
        fileReader.addEventListener("loadend", () => {
          const result = fileReader.result;
          const arr = new Uint8Array(result).subarray(0, 4);
          let header = "";
          let isValid = false;
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }
          switch (header) {
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false;
              break;
          }
          if (isValid)
            observer.next(null);
          else
            observer.next({ mimeType: true });
          observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
      });
      return file$;
    };
  }
};
_ValidationService.\u0275fac = function ValidationService_Factory(t) {
  return new (t || _ValidationService)();
};
_ValidationService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ValidationService, factory: _ValidationService.\u0275fac, providedIn: "root" });
var ValidationService = _ValidationService;

export {
  ThemeService,
  ErrorFieldComponent,
  ValidationService,
  LoadingDataComponent,
  SweetAlertComponent,
  ThaiYearPipe,
  SharedModule
};
//# sourceMappingURL=chunk-6UWJ54NM.js.map
