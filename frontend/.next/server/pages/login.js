"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/login";
exports.ids = ["pages/login"];
exports.modules = {

/***/ "./src/config/config.js":
/*!******************************!*\
  !*** ./src/config/config.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"server\": () => (/* binding */ server)\n/* harmony export */ });\nconst dev = \"development\" === \"production\";\nconst server = dev ? \"https://pizzeria-backend-4vij.onrender.com\" : \"https://pizzeria-backend-4vij.onrender.com\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29uZmlnL2NvbmZpZy5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTUEsTUFBTUMsa0JBQXlCO0FBRTlCLE1BQU1DLFNBQVNGLE1BQU0sK0NBQStDLDRDQUE0QyIsInNvdXJjZXMiOlsid2VicGFjazovL2Zyb250ZW5kLy4vc3JjL2NvbmZpZy9jb25maWcuanM/YjRiYiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXHJcblxyXG5leHBvcnQgY29uc3Qgc2VydmVyID0gZGV2ID8gJ2h0dHBzOi8vcGl6emVyaWEtYmFja2VuZC00dmlqLm9ucmVuZGVyLmNvbScgOiAnaHR0cHM6Ly9waXp6ZXJpYS1iYWNrZW5kLTR2aWoub25yZW5kZXIuY29tJyJdLCJuYW1lcyI6WyJkZXYiLCJwcm9jZXNzIiwic2VydmVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/config/config.js\n");

/***/ }),

/***/ "./src/pages/login.tsx":
/*!*****************************!*\
  !*** ./src/pages/login.tsx ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"getServerSideProps\": () => (/* binding */ getServerSideProps)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/config */ \"./src/config/config.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_2__]);\naxios__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nconst login = ({ user , setUser , setCart  })=>{\n    const [loginData, setLoginData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        email: \"\",\n        password: \"\"\n    });\n    function handleChange(e) {\n        const { name , value  } = e.target;\n        setLoginData((prevData)=>{\n            return {\n                ...prevData,\n                [name]: value\n            };\n        });\n    }\n    async function handleSubmit(e) {\n        axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].defaults.withCredentials = true;\n        e.stopPropagation();\n        e.preventDefault();\n        await (0,axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({\n            method: \"post\",\n            url: `${_config_config__WEBPACK_IMPORTED_MODULE_3__.server}/user/login`,\n            headers: {\n                \"Content-Type\": \"application/x-www-form-urlencoded\",\n                \"Access-Control-Allow-Origin\": `${_config_config__WEBPACK_IMPORTED_MODULE_3__.server}`\n            },\n            data: loginData\n        }).then((res)=>{\n            setUser((prevUser)=>res.data.user);\n            setCart((prevCart)=>res.data.cart);\n            console.log(res);\n        }).catch((e)=>console.log(e));\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"form\", {\n            noValidate: true,\n            onSubmit: handleSubmit,\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                    type: \"email\",\n                    placeholder: \"email\",\n                    onChange: handleChange,\n                    name: \"email\",\n                    value: loginData.email\n                }, void 0, false, {\n                    fileName: \"C:\\\\_Developing\\\\react+nextjs\\\\pizzeria\\\\frontend\\\\src\\\\pages\\\\login.tsx\",\n                    lineNumber: 47,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                    type: \"password\",\n                    placeholder: \"password\",\n                    onChange: handleChange,\n                    name: \"password\",\n                    value: loginData.password\n                }, void 0, false, {\n                    fileName: \"C:\\\\_Developing\\\\react+nextjs\\\\pizzeria\\\\frontend\\\\src\\\\pages\\\\login.tsx\",\n                    lineNumber: 54,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    type: \"submit\",\n                    children: \"Log In\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\_Developing\\\\react+nextjs\\\\pizzeria\\\\frontend\\\\src\\\\pages\\\\login.tsx\",\n                    lineNumber: 61,\n                    columnNumber: 9\n                }, undefined)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\_Developing\\\\react+nextjs\\\\pizzeria\\\\frontend\\\\src\\\\pages\\\\login.tsx\",\n            lineNumber: 46,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\_Developing\\\\react+nextjs\\\\pizzeria\\\\frontend\\\\src\\\\pages\\\\login.tsx\",\n        lineNumber: 45,\n        columnNumber: 5\n    }, undefined);\n};\nconst getServerSideProps = async (context)=>{\n    return {\n        props: {\n            \"1\": 1\n        }\n    };\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (login);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvbG9naW4udHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUF5QjtBQUNBO0FBQ2dCO0FBQ1Q7QUFFaEMsTUFBTUksUUFBUSxDQUFDLEVBQUVDLEtBQUksRUFBRUMsUUFBTyxFQUFFQyxRQUFPLEVBQUUsR0FBSztJQUM1QyxNQUFNLENBQUNDLFdBQVdDLGFBQWEsR0FBR04sK0NBQVFBLENBQUM7UUFDekNPLE9BQU87UUFDUEMsVUFBVTtJQUNaO0lBRUEsU0FBU0MsYUFBYUMsQ0FBQyxFQUFFO1FBQ3ZCLE1BQU0sRUFBRUMsS0FBSSxFQUFFQyxNQUFLLEVBQUUsR0FBR0YsRUFBRUcsTUFBTTtRQUNoQ1AsYUFBYVEsQ0FBQUEsV0FBWTtZQUN2QixPQUFPO2dCQUNMLEdBQUdBLFFBQVE7Z0JBQ1gsQ0FBQ0gsS0FBSyxFQUFFQztZQUNWO1FBQ0Y7SUFDRjtJQUVBLGVBQWVHLGFBQWFMLENBQUMsRUFBRTtRQUM3Qlosc0VBQThCLEdBQUcsSUFBSTtRQUNyQ1ksRUFBRVEsZUFBZTtRQUNqQlIsRUFBRVMsY0FBYztRQUVoQixNQUFNckIsaURBQUtBLENBQUM7WUFDVnNCLFFBQVE7WUFDUkMsS0FBSyxDQUFDLEVBQUV0QixrREFBTUEsQ0FBQyxXQUFXLENBQUM7WUFDM0J1QixTQUFTO2dCQUNQLGdCQUFnQjtnQkFDaEIsK0JBQStCLENBQUMsRUFBRXZCLGtEQUFNQSxDQUFDLENBQUM7WUFDNUM7WUFDQXdCLE1BQU1sQjtRQUNSLEdBQ0dtQixJQUFJLENBQUNDLENBQUFBLE1BQU87WUFDWHRCLFFBQVF1QixDQUFBQSxXQUFZRCxJQUFJRixJQUFJLENBQUNyQixJQUFJO1lBQ2pDRSxRQUFRdUIsQ0FBQUEsV0FBWUYsSUFBSUYsSUFBSSxDQUFDSyxJQUFJO1lBQ2pDQyxRQUFRQyxHQUFHLENBQUNMO1FBQ2QsR0FDQ00sS0FBSyxDQUFDckIsQ0FBQUEsSUFBS21CLFFBQVFDLEdBQUcsQ0FBQ3BCO0lBQzVCO0lBRUEscUJBQ0UsOERBQUNzQjtrQkFDQyw0RUFBQ0M7WUFBS0MsVUFBVTtZQUFDQyxVQUFVcEI7OzhCQUN6Qiw4REFBQ3FCO29CQUNDQyxNQUFLO29CQUNMQyxhQUFZO29CQUNaQyxVQUFVOUI7b0JBQ1ZFLE1BQUs7b0JBQ0xDLE9BQU9QLFVBQVVFLEtBQUs7Ozs7Ozs4QkFFeEIsOERBQUM2QjtvQkFDQ0MsTUFBSztvQkFDTEMsYUFBWTtvQkFDWkMsVUFBVTlCO29CQUNWRSxNQUFLO29CQUNMQyxPQUFPUCxVQUFVRyxRQUFROzs7Ozs7OEJBRTNCLDhEQUFDZ0M7b0JBQU9ILE1BQUs7OEJBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSTlCO0FBRU8sTUFBTUkscUJBQXFCLE9BQU9DLFVBQVk7SUFDbkQsT0FBTztRQUNMQyxPQUFPO1lBQ0wsS0FBSztRQUNQO0lBQ0Y7QUFDRixFQUFDO0FBR0QsaUVBQWUxQyxLQUFLQSxFQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9zcmMvcGFnZXMvbG9naW4udHN4PzExZTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXHJcbmltcG9ydCB7IHNlcnZlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnXHJcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXHJcblxyXG5jb25zdCBsb2dpbiA9ICh7IHVzZXIsIHNldFVzZXIsIHNldENhcnQgfSkgPT4ge1xyXG4gIGNvbnN0IFtsb2dpbkRhdGEsIHNldExvZ2luRGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICBlbWFpbDogJycsXHJcbiAgICBwYXNzd29yZDogJydcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXRcclxuICAgIHNldExvZ2luRGF0YShwcmV2RGF0YSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4ucHJldkRhdGEsXHJcbiAgICAgICAgW25hbWVdOiB2YWx1ZVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGUpIHtcclxuICAgIGF4aW9zLmRlZmF1bHRzLndpdGhDcmVkZW50aWFscyA9IHRydWVcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIGF3YWl0IGF4aW9zKHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIHVybDogYCR7c2VydmVyfS91c2VyL2xvZ2luYCxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IGAke3NlcnZlcn1gXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IGxvZ2luRGF0YVxyXG4gICAgfSlcclxuICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICBzZXRVc2VyKHByZXZVc2VyID0+IHJlcy5kYXRhLnVzZXIpXHJcbiAgICAgICAgc2V0Q2FydChwcmV2Q2FydCA9PiByZXMuZGF0YS5jYXJ0KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPG1haW4+XHJcbiAgICAgIDxmb3JtIG5vVmFsaWRhdGUgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICB0eXBlPVwiZW1haWxcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9J2VtYWlsJ1xyXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgIG5hbWU9XCJlbWFpbFwiXHJcbiAgICAgICAgICB2YWx1ZT17bG9naW5EYXRhLmVtYWlsfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICB2YWx1ZT17bG9naW5EYXRhLnBhc3N3b3JkfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPSdzdWJtaXQnPkxvZyBJbjwvYnV0dG9uPlxyXG4gICAgICA8L2Zvcm0+XHJcbiAgICA8L21haW4+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2VydmVyU2lkZVByb3BzID0gYXN5bmMgKGNvbnRleHQpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgcHJvcHM6IHtcclxuICAgICAgJzEnOiAxXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbG9naW4iXSwibmFtZXMiOlsiUmVhY3QiLCJheGlvcyIsInNlcnZlciIsInVzZVN0YXRlIiwibG9naW4iLCJ1c2VyIiwic2V0VXNlciIsInNldENhcnQiLCJsb2dpbkRhdGEiLCJzZXRMb2dpbkRhdGEiLCJlbWFpbCIsInBhc3N3b3JkIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsInByZXZEYXRhIiwiaGFuZGxlU3VibWl0IiwiZGVmYXVsdHMiLCJ3aXRoQ3JlZGVudGlhbHMiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1ldGhvZCIsInVybCIsImhlYWRlcnMiLCJkYXRhIiwidGhlbiIsInJlcyIsInByZXZVc2VyIiwicHJldkNhcnQiLCJjYXJ0IiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwibWFpbiIsImZvcm0iLCJub1ZhbGlkYXRlIiwib25TdWJtaXQiLCJpbnB1dCIsInR5cGUiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwiYnV0dG9uIiwiZ2V0U2VydmVyU2lkZVByb3BzIiwiY29udGV4dCIsInByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/login.tsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = import("axios");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/login.tsx"));
module.exports = __webpack_exports__;

})();