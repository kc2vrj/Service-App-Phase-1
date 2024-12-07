"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/timesheet-weekly",{

/***/ "./src/components/WeeklyTimesheet.js":
/*!*******************************************!*\
  !*** ./src/components/WeeklyTimesheet.js ***!
  \*******************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _home_code_timsheet_new_node_modules_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/regenerator-runtime/runtime.js */ \"./node_modules/regenerator-runtime/runtime.js\");\n/* harmony import */ var _home_code_timsheet_new_node_modules_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_home_code_timsheet_new_node_modules_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var _lib_firebase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/firebase */ \"./src/lib/firebase.js\");\n/* harmony import */ var _TimesheetForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TimesheetForm */ \"./src/components/TimesheetForm.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n\n\n\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {\n    try {\n        var info = gen[key](arg);\n        var value = info.value;\n    } catch (error) {\n        reject(error);\n        return;\n    }\n    if (info.done) {\n        resolve(value);\n    } else {\n        Promise.resolve(value).then(_next, _throw);\n    }\n}\nfunction _asyncToGenerator(fn) {\n    return function() {\n        var self = this, args = arguments;\n        return new Promise(function(resolve, reject) {\n            var gen = fn.apply(self, args);\n            function _next(value) {\n                asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value);\n            }\n            function _throw(err) {\n                asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err);\n            }\n            _next(undefined);\n        });\n    };\n}\nfunction _defineProperty(obj, key, value) {\n    if (key in obj) {\n        Object.defineProperty(obj, key, {\n            value: value,\n            enumerable: true,\n            configurable: true,\n            writable: true\n        });\n    } else {\n        obj[key] = value;\n    }\n    return obj;\n}\nfunction _objectSpread(target) {\n    for(var i = 1; i < arguments.length; i++){\n        var source = arguments[i] != null ? arguments[i] : {\n        };\n        var ownKeys = Object.keys(source);\n        if (typeof Object.getOwnPropertySymbols === \"function\") {\n            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {\n                return Object.getOwnPropertyDescriptor(source, sym).enumerable;\n            }));\n        }\n        ownKeys.forEach(function(key) {\n            _defineProperty(target, key, source[key]);\n        });\n    }\n    return target;\n}\nvar _this = undefined;\nvar _s = $RefreshSig$();\nvar WeeklyTimesheet = function(param1) {\n    var user = param1.user;\n    var _this1 = _this;\n    var getWeekDates = function getWeekDates(param) {\n        var date = param === void 0 ? new Date() : param;\n        var curr = new Date(date);\n        var first = curr.getDate() - curr.getDay();\n        return Array(7).fill().map(function(_, i) {\n            var day = new Date(curr.setDate(first + i));\n            return day.toISOString().split('T')[0];\n        });\n    };\n    _s();\n    var ref5 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(getWeekDates()), currentWeek = ref5[0], setCurrentWeek = ref5[1];\n    var ref1 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([]), entries = ref1[0], setEntries = ref1[1];\n    var ref2 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null), editingEntry = ref2[0], setEditingEntry = ref2[1];\n    var ref3 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), isWeekLocked = ref3[0], setIsWeekLocked = ref3[1];\n    var ref4 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null), error = ref4[0], setError = ref4[1];\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {\n        if (!user) return;\n        var fetchWeekEntries = _asyncToGenerator(_home_code_timsheet_new_node_modules_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {\n            var ref, entriesRef, q, snapshot, allEntries, weekEntries, weekStatusRef, weekStatusDoc;\n            return _home_code_timsheet_new_node_modules_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {\n                while(1)switch(_ctx.prev = _ctx.next){\n                    case 0:\n                        _ctx.prev = 0;\n                        ;\n                        entriesRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.collection)(_lib_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'timesheet_entries');\n                        q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.query)(entriesRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.where)('userId', '==', user.id));\n                        _ctx.next = 6;\n                        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getDocs)(q);\n                    case 6:\n                        snapshot = _ctx.sent;\n                        allEntries = snapshot.docs.map(function(doc) {\n                            return _objectSpread({\n                                id: doc.id\n                            }, doc.data());\n                        });\n                        weekEntries = allEntries.filter(function(entry) {\n                            return entry.date >= currentWeek[0] && entry.date <= currentWeek[6];\n                        });\n                        setEntries(weekEntries);\n                        setError(null);\n                        weekStatusRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_lib_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'timesheet_weeks', currentWeek[0]);\n                        _ctx.next = 14;\n                        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getDoc)(weekStatusRef);\n                    case 14:\n                        weekStatusDoc = _ctx.sent;\n                        setIsWeekLocked(weekStatusDoc.exists() ? ((ref = weekStatusDoc.data()) === null || ref === void 0 ? void 0 : ref.approved) || false : false);\n                        _ctx.next = 22;\n                        break;\n                    case 18:\n                        _ctx.prev = 18;\n                        _ctx.t0 = _ctx[\"catch\"](0);\n                        console.error('Error fetching entries:', _ctx.t0);\n                        if (_ctx.t0.message.includes('requires an index')) {\n                            setError(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"div\", {\n                                className: \"bg-yellow-50 border-l-4 border-yellow-400 p-4\",\n                                __source: {\n                                    fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                    lineNumber: 59,\n                                    columnNumber: 13\n                                },\n                                __self: this,\n                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(\"div\", {\n                                    className: \"flex\",\n                                    __source: {\n                                        fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                        lineNumber: 60,\n                                        columnNumber: 15\n                                    },\n                                    __self: this,\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"div\", {\n                                            className: \"flex-shrink-0\",\n                                            __source: {\n                                                fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                lineNumber: 61,\n                                                columnNumber: 17\n                                            },\n                                            __self: this,\n                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"svg\", {\n                                                className: \"h-5 w-5 text-yellow-400\",\n                                                xmlns: \"http://www.w3.org/2000/svg\",\n                                                viewBox: \"0 0 20 20\",\n                                                fill: \"currentColor\",\n                                                __source: {\n                                                    fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                    lineNumber: 62,\n                                                    columnNumber: 19\n                                                },\n                                                __self: this,\n                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"path\", {\n                                                    fillRule: \"evenodd\",\n                                                    d: \"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z\",\n                                                    clipRule: \"evenodd\",\n                                                    __source: {\n                                                        fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                        lineNumber: 63,\n                                                        columnNumber: 21\n                                                    },\n                                                    __self: this\n                                                })\n                                            })\n                                        }),\n                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(\"div\", {\n                                            className: \"ml-3\",\n                                            __source: {\n                                                fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                lineNumber: 66,\n                                                columnNumber: 17\n                                            },\n                                            __self: this,\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"p\", {\n                                                    className: \"text-sm text-yellow-700\",\n                                                    __source: {\n                                                        fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                        lineNumber: 67,\n                                                        columnNumber: 19\n                                                    },\n                                                    __self: this,\n                                                    children: \"The database index is being created. This may take a few minutes. Please refresh the page shortly.\"\n                                                }),\n                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"p\", {\n                                                    className: \"mt-2 text-sm\",\n                                                    __source: {\n                                                        fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                        lineNumber: 70,\n                                                        columnNumber: 19\n                                                    },\n                                                    __self: this,\n                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"a\", {\n                                                        href: _ctx.t0.message.split('You can create it here: ')[1],\n                                                        target: \"_blank\",\n                                                        rel: \"noopener noreferrer\",\n                                                        className: \"text-yellow-700 underline hover:text-yellow-600\",\n                                                        __source: {\n                                                            fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                                                            lineNumber: 71,\n                                                            columnNumber: 21\n                                                        },\n                                                        __self: this,\n                                                        children: \"Click here to view index creation status\"\n                                                    })\n                                                })\n                                            ]\n                                        })\n                                    ]\n                                })\n                            }));\n                        } else {\n                            setError('Failed to load timesheet entries. Please try again later.');\n                        }\n                    case 22:\n                    case \"end\":\n                        return _ctx.stop();\n                }\n            }, _callee, this, [\n                [\n                    0,\n                    18\n                ]\n            ]);\n        }).bind(_this1)).bind(_this1);\n        fetchWeekEntries();\n    }, [\n        currentWeek[0],\n        user\n    ]);\n    // ... rest of your component code stays the same ...\n    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"div\", {\n        className: \"p-6\",\n        __source: {\n            fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n            lineNumber: 96,\n            columnNumber: 5\n        },\n        __self: _this,\n        children: error && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"div\", {\n            className: \"mb-4\",\n            __source: {\n                fileName: \"/home/code/timsheet-new/src/components/WeeklyTimesheet.js\",\n                lineNumber: 98,\n                columnNumber: 9\n            },\n            __self: _this,\n            children: error\n        })\n    }));\n};\n_s(WeeklyTimesheet, \"o3YAsZtJLqACjJLfb7Hb0rjCGj4=\");\n_c = WeeklyTimesheet;\n/* harmony default export */ __webpack_exports__[\"default\"] = (WeeklyTimesheet);\nvar _c;\n$RefreshReg$(_c, \"WeeklyTimesheet\");\n\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9XZWVrbHlUaW1lc2hlZXQuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFrRDtBQUNrQztBQUNrQjtBQUNsRTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRTNDLEdBQUssQ0FBQ21CLGVBQWUsR0FBRyxRQUFRLFNBQU0sQ0FBQztRQUFaQyxJQUFJLFVBQUpBLElBQUk7O1FBT3BCQyxZQUFZLEdBQXJCLFFBQVEsQ0FBQ0EsWUFBWSxDQUFDQyxLQUFpQixFQUFFLENBQUM7WUFBcEJBLElBQUksR0FBSkEsS0FBaUIsY0FBVixHQUFHLENBQUNDLElBQUksS0FBZkQsS0FBaUI7UUFDckMsR0FBSyxDQUFDRSxJQUFJLEdBQUcsR0FBRyxDQUFDRCxJQUFJLENBQUNELElBQUk7UUFDMUIsR0FBSyxDQUFDRyxLQUFLLEdBQUdELElBQUksQ0FBQ0UsT0FBTyxLQUFLRixJQUFJLENBQUNHLE1BQU07UUFFMUMsTUFBTSxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFQyxJQUFJLEdBQUdDLEdBQUcsQ0FBQyxRQUFRLENBQVBDLENBQUMsRUFBRUMsQ0FBQyxFQUFLLENBQUM7WUFDcEMsR0FBSyxDQUFDQyxHQUFHLEdBQUcsR0FBRyxDQUFDVixJQUFJLENBQUNDLElBQUksQ0FBQ1UsT0FBTyxDQUFDVCxLQUFLLEdBQUdPLENBQUM7WUFDM0MsTUFBTSxDQUFDQyxHQUFHLENBQUNFLFdBQVcsR0FBR0MsS0FBSyxDQUFDLENBQUcsSUFBRSxDQUFDO1FBQ3ZDLENBQUM7SUFDSCxDQUFDOztJQWRELEdBQUssQ0FBaUNuQyxJQUF3QixHQUF4QkEsK0NBQVEsQ0FBQ29CLFlBQVksS0FBcERnQixXQUFXLEdBQW9CcEMsSUFBd0IsS0FBMUNxQyxjQUFjLEdBQUlyQyxJQUF3QjtJQUM5RCxHQUFLLENBQXlCQSxJQUFZLEdBQVpBLCtDQUFRLENBQUMsQ0FBQyxDQUFDLEdBQWxD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Ozs7Ozs7Ozs4R0FHcFFSLENBQUc7NENBQUNDLFNBQVMsRUFBQyxDQUFNOzs7Ozs7OztxSEFDbEJRLENBQUM7b0RBQUNSLFNBQVMsRUFBQyxDQUF5Qjs7Ozs7Ozs4REFBQyxDQUV2Qzs7cUhBQ0NRLENBQUM7b0RBQUNSLFNBQVMsRUFBQyxDQUFjOzs7Ozs7O21JQUN4QlMsQ0FBQzt3REFDQUMsSUFBSSxVQUFRYixPQUFPLENBQUMzQixLQUFLLENBQUMsQ0FBMEIsMkJBQUUsQ0FBQzt3REFDdkR5QyxNQUFNLEVBQUMsQ0FBUTt3REFDZkMsR0FBRyxFQUFDLENBQXFCO3dEQUN6QlosU0FBUyxFQUFDLENBQWlEOzs7Ozs7O2tFQUM1RCxDQUVEOzs7Ozs7Ozt3QkFNWixDQUFDLE1BQU0sQ0FBQzs0QkFDTnBCLFFBQVEsQ0FBQyxDQUEyRDt3QkFDdEUsQ0FBQzs7Ozs7Ozs7Ozs7UUFFTCxDQUFDO1FBRURDLGdCQUFnQjtJQUNsQixDQUFDLEVBQUUsQ0FBQ1Y7UUFBQUEsV0FBVyxDQUFDLENBQUM7UUFBR2pCLElBQUk7SUFBQSxDQUFDO0lBRXpCLEVBQXFEO0lBRXJELE1BQU0sc0VBQ0g2QyxDQUFHO1FBQUNDLFNBQVMsRUFBQyxDQUFLOzs7Ozs7O2tCQUNqQnJCLEtBQUsseUVBQ0hvQixDQUFHO1lBQUNDLFNBQVMsRUFBQyxDQUFNOzs7Ozs7O3NCQUNsQnJCLEtBQUs7OztBQU9oQixDQUFDO0dBbkdLMUIsZUFBZTtLQUFmQSxlQUFlO0FBcUdyQiwrREFBZUEsZUFBZSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9jb21wb25lbnRzL1dlZWtseVRpbWVzaGVldC5qcz9hNDNjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQ2hldnJvbkxlZnQsIENoZXZyb25SaWdodCwgUGx1cywgRWRpdDIsIENoZWNrLCBNYXBQaW4gfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IHsgY29sbGVjdGlvbiwgcXVlcnksIHdoZXJlLCBnZXREb2NzLCB1cGRhdGVEb2MsIGRvYywgZ2V0RG9jLCBhZGREb2MgfSBmcm9tICdmaXJlYmFzZS9maXJlc3RvcmUnO1xuaW1wb3J0IHsgZGIgfSBmcm9tICcuLi9saWIvZmlyZWJhc2UnO1xuaW1wb3J0IFRpbWVzaGVldEZvcm0gZnJvbSAnLi9UaW1lc2hlZXRGb3JtJztcblxuY29uc3QgV2Vla2x5VGltZXNoZWV0ID0gKHsgdXNlciB9KSA9PiB7XG4gIGNvbnN0IFtjdXJyZW50V2Vlaywgc2V0Q3VycmVudFdlZWtdID0gdXNlU3RhdGUoZ2V0V2Vla0RhdGVzKCkpO1xuICBjb25zdCBbZW50cmllcywgc2V0RW50cmllc10gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFtlZGl0aW5nRW50cnksIHNldEVkaXRpbmdFbnRyeV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2lzV2Vla0xvY2tlZCwgc2V0SXNXZWVrTG9ja2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcblxuICBmdW5jdGlvbiBnZXRXZWVrRGF0ZXMoZGF0ZSA9IG5ldyBEYXRlKCkpIHtcbiAgICBjb25zdCBjdXJyID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY29uc3QgZmlyc3QgPSBjdXJyLmdldERhdGUoKSAtIGN1cnIuZ2V0RGF5KCk7XG4gICAgXG4gICAgcmV0dXJuIEFycmF5KDcpLmZpbGwoKS5tYXAoKF8sIGkpID0+IHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKGN1cnIuc2V0RGF0ZShmaXJzdCArIGkpKTtcbiAgICAgIHJldHVybiBkYXkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xuICAgIH0pO1xuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHJldHVybjtcblxuICAgIGNvbnN0IGZldGNoV2Vla0VudHJpZXMgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBVc2UgYSBzaW1wbGVyIHF1ZXJ5IGZpcnN0XG4gICAgICAgIGNvbnN0IGVudHJpZXNSZWYgPSBjb2xsZWN0aW9uKGRiLCAndGltZXNoZWV0X2VudHJpZXMnKTtcbiAgICAgICAgY29uc3QgcSA9IHF1ZXJ5KFxuICAgICAgICAgIGVudHJpZXNSZWYsXG4gICAgICAgICAgd2hlcmUoJ3VzZXJJZCcsICc9PScsIHVzZXIuaWQpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXREb2NzKHEpO1xuICAgICAgICBjb25zdCBhbGxFbnRyaWVzID0gc25hcHNob3QuZG9jcy5tYXAoZG9jID0+ICh7XG4gICAgICAgICAgaWQ6IGRvYy5pZCxcbiAgICAgICAgICAuLi5kb2MuZGF0YSgpXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyBGaWx0ZXIgZGF0ZXMgaW4gbWVtb3J5XG4gICAgICAgIGNvbnN0IHdlZWtFbnRyaWVzID0gYWxsRW50cmllcy5maWx0ZXIoZW50cnkgPT4gXG4gICAgICAgICAgZW50cnkuZGF0ZSA+PSBjdXJyZW50V2Vla1swXSAmJiBcbiAgICAgICAgICBlbnRyeS5kYXRlIDw9IGN1cnJlbnRXZWVrWzZdXG4gICAgICAgICk7XG5cbiAgICAgICAgc2V0RW50cmllcyh3ZWVrRW50cmllcyk7XG4gICAgICAgIHNldEVycm9yKG51bGwpO1xuXG4gICAgICAgIC8vIEZldGNoIHdlZWsgc3RhdHVzXG4gICAgICAgIGNvbnN0IHdlZWtTdGF0dXNSZWYgPSBkb2MoZGIsICd0aW1lc2hlZXRfd2Vla3MnLCBjdXJyZW50V2Vla1swXSk7XG4gICAgICAgIGNvbnN0IHdlZWtTdGF0dXNEb2MgPSBhd2FpdCBnZXREb2Mod2Vla1N0YXR1c1JlZik7XG4gICAgICAgIHNldElzV2Vla0xvY2tlZCh3ZWVrU3RhdHVzRG9jLmV4aXN0cygpID8gd2Vla1N0YXR1c0RvYy5kYXRhKCk/LmFwcHJvdmVkIHx8IGZhbHNlIDogZmFsc2UpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgZW50cmllczonLCBlcnJvcik7XG4gICAgICAgIGlmIChlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdyZXF1aXJlcyBhbiBpbmRleCcpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXllbGxvdy01MCBib3JkZXItbC00IGJvcmRlci15ZWxsb3ctNDAwIHAtNFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXhcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXllbGxvdy00MDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyMCAyMFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbFJ1bGU9XCJldmVub2RkXCIgZD1cIk04LjI1NyAzLjA5OWMuNzY1LTEuMzYgMi43MjItMS4zNiAzLjQ4NiAwbDUuNTggOS45MmMuNzUgMS4zMzQtLjIxMyAyLjk4LTEuNzQyIDIuOThINC40MmMtMS41MyAwLTIuNDkzLTEuNjQ2LTEuNzQzLTIuOThsNS41OC05Ljkyek0xMSAxM2ExIDEgMCAxMS0yIDAgMSAxIDAgMDEyIDB6bS0xLThhMSAxIDAgMDAtMSAxdjNhMSAxIDAgMDAyIDBWNmExIDEgMCAwMC0xLTF6XCIgY2xpcFJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWwtM1wiPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXllbGxvdy03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgVGhlIGRhdGFiYXNlIGluZGV4IGlzIGJlaW5nIGNyZWF0ZWQuIFRoaXMgbWF5IHRha2UgYSBmZXcgbWludXRlcy4gUGxlYXNlIHJlZnJlc2ggdGhlIHBhZ2Ugc2hvcnRseS5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC1zbVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPXtlcnJvci5tZXNzYWdlLnNwbGl0KCdZb3UgY2FuIGNyZWF0ZSBpdCBoZXJlOiAnKVsxXX1cbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteWVsbG93LTcwMCB1bmRlcmxpbmUgaG92ZXI6dGV4dC15ZWxsb3ctNjAwXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIENsaWNrIGhlcmUgdG8gdmlldyBpbmRleCBjcmVhdGlvbiBzdGF0dXNcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0ZhaWxlZCB0byBsb2FkIHRpbWVzaGVldCBlbnRyaWVzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZldGNoV2Vla0VudHJpZXMoKTtcbiAgfSwgW2N1cnJlbnRXZWVrWzBdLCB1c2VyXSk7XG5cbiAgLy8gLi4uIHJlc3Qgb2YgeW91ciBjb21wb25lbnQgY29kZSBzdGF5cyB0aGUgc2FtZSAuLi5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cbiAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIFxuICAgICAgey8qIC4uLiByZXN0IG9mIHlvdXIgSlNYIHN0YXlzIHRoZSBzYW1lIC4uLiAqL31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFdlZWtseVRpbWVzaGVldDsiXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIkNoZXZyb25MZWZ0IiwiQ2hldnJvblJpZ2h0IiwiUGx1cyIsIkVkaXQyIiwiQ2hlY2siLCJNYXBQaW4iLCJjb2xsZWN0aW9uIiwicXVlcnkiLCJ3aGVyZSIsImdldERvY3MiLCJ1cGRhdGVEb2MiLCJkb2MiLCJnZXREb2MiLCJhZGREb2MiLCJkYiIsIlRpbWVzaGVldEZvcm0iLCJXZWVrbHlUaW1lc2hlZXQiLCJ1c2VyIiwiZ2V0V2Vla0RhdGVzIiwiZGF0ZSIsIkRhdGUiLCJjdXJyIiwiZmlyc3QiLCJnZXREYXRlIiwiZ2V0RGF5IiwiQXJyYXkiLCJmaWxsIiwibWFwIiwiXyIsImkiLCJkYXkiLCJzZXREYXRlIiwidG9JU09TdHJpbmciLCJzcGxpdCIsImN1cnJlbnRXZWVrIiwic2V0Q3VycmVudFdlZWsiLCJlbnRyaWVzIiwic2V0RW50cmllcyIsImVkaXRpbmdFbnRyeSIsInNldEVkaXRpbmdFbnRyeSIsImlzV2Vla0xvY2tlZCIsInNldElzV2Vla0xvY2tlZCIsImVycm9yIiwic2V0RXJyb3IiLCJmZXRjaFdlZWtFbnRyaWVzIiwid2Vla1N0YXR1c0RvYyIsImVudHJpZXNSZWYiLCJxIiwic25hcHNob3QiLCJhbGxFbnRyaWVzIiwid2Vla0VudHJpZXMiLCJ3ZWVrU3RhdHVzUmVmIiwiaWQiLCJkb2NzIiwiZGF0YSIsImZpbHRlciIsImVudHJ5IiwiZXhpc3RzIiwiYXBwcm92ZWQiLCJjb25zb2xlIiwibWVzc2FnZSIsImluY2x1ZGVzIiwiZGl2IiwiY2xhc3NOYW1lIiwic3ZnIiwieG1sbnMiLCJ2aWV3Qm94IiwicGF0aCIsImZpbGxSdWxlIiwiZCIsImNsaXBSdWxlIiwicCIsImEiLCJocmVmIiwidGFyZ2V0IiwicmVsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/WeeklyTimesheet.js\n");

/***/ })

});