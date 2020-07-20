var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "react", "recoil", "./logger"], function (require, exports, react_1, recoil_1, logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RecoilLogger = void 0;
    logger_1 = __importDefault(logger_1);
    exports.RecoilLogger = function (_a) {
        var values = _a.values, _b = _a.next, next = _b === void 0 ? function () { return null; } : _b, _c = _a.logger, logger = _c === void 0 ? logger_1.default : _c, _d = _a.actionTransformer, actionTransformer = _d === void 0 ? function () { return 'state update'; } : _d;
        var _e = react_1.useState({ prevState: {}, nextState: {} }), state = _e[0], setState = _e[1];
        recoil_1.useRecoilTransactionObserver_UNSTABLE(function (_a) {
            var previousSnapshot = _a.previousSnapshot, snapshot = _a.snapshot;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    values === null || values === void 0 ? void 0 : values.forEach(function (value) { return __awaiter(void 0, void 0, void 0, function () {
                        var previousValue, nextValue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, previousSnapshot.getPromise(value)];
                                case 1:
                                    previousValue = _a.sent();
                                    return [4 /*yield*/, snapshot.getPromise(value)];
                                case 2:
                                    nextValue = _a.sent();
                                    setState(function (_a) {
                                        var _b, _c;
                                        var prevState = _a.prevState, nextState = _a.nextState;
                                        return ({
                                            prevState: __assign(__assign({}, prevState), (_b = {}, _b[value.key] = previousValue, _b)),
                                            nextState: __assign(__assign({}, nextState), (_c = {}, _c[value.key] = nextValue, _c))
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            });
        });
        react_1.useEffect(function () {
            logger(next)(__assign(__assign({}, state), { action: actionTransformer(state) }));
        }, [state]);
        return null;
    };
});
