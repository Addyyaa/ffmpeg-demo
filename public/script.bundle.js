/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js":
/*!*********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFmpeg: () => (/* binding */ FFmpeg)\n/* harmony export */ });\n/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./const.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js\");\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js\");\n\n\n\n/**\n * Provides APIs to interact with ffmpeg web worker.\n *\n * @example\n * ```ts\n * const ffmpeg = new FFmpeg();\n * ```\n */\nclass FFmpeg {\n    #worker = null;\n    /**\n     * #resolves and #rejects tracks Promise resolves and rejects to\n     * be called when we receive message from web worker.\n     */\n    #resolves = {};\n    #rejects = {};\n    #logEventCallbacks = [];\n    #progressEventCallbacks = [];\n    loaded = false;\n    /**\n     * register worker message event handlers.\n     */\n    #registerHandlers = () => {\n        if (this.#worker) {\n            this.#worker.onmessage = ({ data: { id, type, data }, }) => {\n                switch (type) {\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOAD:\n                        this.loaded = true;\n                        this.#resolves[id](data);\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.MOUNT:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.UNMOUNT:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.EXEC:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.WRITE_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.READ_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.RENAME:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.CREATE_DIR:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LIST_DIR:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_DIR:\n                        this.#resolves[id](data);\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOG:\n                        this.#logEventCallbacks.forEach((f) => f(data));\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.PROGRESS:\n                        this.#progressEventCallbacks.forEach((f) => f(data));\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.ERROR:\n                        this.#rejects[id](data);\n                        break;\n                }\n                delete this.#resolves[id];\n                delete this.#rejects[id];\n            };\n        }\n    };\n    /**\n     * Generic function to send messages to web worker.\n     */\n    #send = ({ type, data }, trans = [], signal) => {\n        if (!this.#worker) {\n            return Promise.reject(_errors_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_NOT_LOADED);\n        }\n        return new Promise((resolve, reject) => {\n            const id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getMessageID)();\n            this.#worker && this.#worker.postMessage({ id, type, data }, trans);\n            this.#resolves[id] = resolve;\n            this.#rejects[id] = reject;\n            signal?.addEventListener(\"abort\", () => {\n                reject(new DOMException(`Message # ${id} was aborted`, \"AbortError\"));\n            }, { once: true });\n        });\n    };\n    on(event, callback) {\n        if (event === \"log\") {\n            this.#logEventCallbacks.push(callback);\n        }\n        else if (event === \"progress\") {\n            this.#progressEventCallbacks.push(callback);\n        }\n    }\n    off(event, callback) {\n        if (event === \"log\") {\n            this.#logEventCallbacks = this.#logEventCallbacks.filter((f) => f !== callback);\n        }\n        else if (event === \"progress\") {\n            this.#progressEventCallbacks = this.#progressEventCallbacks.filter((f) => f !== callback);\n        }\n    }\n    /**\n     * Loads ffmpeg-core inside web worker. It is required to call this method first\n     * as it initializes WebAssembly and other essential variables.\n     *\n     * @category FFmpeg\n     * @returns `true` if ffmpeg core is loaded for the first time.\n     */\n    load = ({ classWorkerURL, ...config } = {}, { signal } = {}) => {\n        if (!this.#worker) {\n            this.#worker = classWorkerURL ?\n                new Worker(new URL(classWorkerURL, \"file:///D:/jsProject/ffmpeg-demo/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js\"), {\n                    type: \"module\",\n                }) :\n                // We need to duplicated the code here to enable webpack\n                // to bundle worekr.js here.\n                new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(\"node_modules_ffmpeg_ffmpeg_dist_esm_worker_js\"), __webpack_require__.b), {\n                    type: undefined,\n                });\n            this.#registerHandlers();\n        }\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOAD,\n            data: config,\n        }, undefined, signal);\n    };\n    /**\n     * Execute ffmpeg command.\n     *\n     * @remarks\n     * To avoid common I/O issues, [\"-nostdin\", \"-y\"] are prepended to the args\n     * by default.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", ...);\n     * // ffmpeg -i video.avi video.mp4\n     * await ffmpeg.exec([\"-i\", \"video.avi\", \"video.mp4\"]);\n     * const data = ffmpeg.readFile(\"video.mp4\");\n     * ```\n     *\n     * @returns `0` if no error, `!= 0` if timeout (1) or error.\n     * @category FFmpeg\n     */\n    exec = (\n    /** ffmpeg command line args */\n    args, \n    /**\n     * milliseconds to wait before stopping the command execution.\n     *\n     * @defaultValue -1\n     */\n    timeout = -1, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.EXEC,\n        data: { args, timeout },\n    }, undefined, signal);\n    /**\n     * Terminate all ongoing API calls and terminate web worker.\n     * `FFmpeg.load()` must be called again before calling any other APIs.\n     *\n     * @category FFmpeg\n     */\n    terminate = () => {\n        const ids = Object.keys(this.#rejects);\n        // rejects all incomplete Promises.\n        for (const id of ids) {\n            this.#rejects[id](_errors_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_TERMINATED);\n            delete this.#rejects[id];\n            delete this.#resolves[id];\n        }\n        if (this.#worker) {\n            this.#worker.terminate();\n            this.#worker = null;\n            this.loaded = false;\n        }\n    };\n    /**\n     * Write data to ffmpeg.wasm.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", await fetchFile(\"../video.avi\"));\n     * await ffmpeg.writeFile(\"text.txt\", \"hello world\");\n     * ```\n     *\n     * @category File System\n     */\n    writeFile = (path, data, { signal } = {}) => {\n        const trans = [];\n        if (data instanceof Uint8Array) {\n            trans.push(data.buffer);\n        }\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.WRITE_FILE,\n            data: { path, data },\n        }, trans, signal);\n    };\n    mount = (fsType, options, mountPoint) => {\n        const trans = [];\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.MOUNT,\n            data: { fsType, options, mountPoint },\n        }, trans);\n    };\n    unmount = (mountPoint) => {\n        const trans = [];\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.UNMOUNT,\n            data: { mountPoint },\n        }, trans);\n    };\n    /**\n     * Read data from ffmpeg.wasm.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * const data = await ffmpeg.readFile(\"video.mp4\");\n     * ```\n     *\n     * @category File System\n     */\n    readFile = (path, \n    /**\n     * File content encoding, supports two encodings:\n     * - utf8: read file as text file, return data in string type.\n     * - binary: read file as binary file, return data in Uint8Array type.\n     *\n     * @defaultValue binary\n     */\n    encoding = \"binary\", { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.READ_FILE,\n        data: { path, encoding },\n    }, undefined, signal);\n    /**\n     * Delete a file.\n     *\n     * @category File System\n     */\n    deleteFile = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_FILE,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * Rename a file or directory.\n     *\n     * @category File System\n     */\n    rename = (oldPath, newPath, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.RENAME,\n        data: { oldPath, newPath },\n    }, undefined, signal);\n    /**\n     * Create a directory.\n     *\n     * @category File System\n     */\n    createDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.CREATE_DIR,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * List directory contents.\n     *\n     * @category File System\n     */\n    listDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LIST_DIR,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * Delete an empty directory.\n     *\n     * @category File System\n     */\n    deleteDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_DIR,\n        data: { path },\n    }, undefined, signal);\n}\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CORE_URL: () => (/* binding */ CORE_URL),\n/* harmony export */   CORE_VERSION: () => (/* binding */ CORE_VERSION),\n/* harmony export */   FFMessageType: () => (/* binding */ FFMessageType),\n/* harmony export */   MIME_TYPE_JAVASCRIPT: () => (/* binding */ MIME_TYPE_JAVASCRIPT),\n/* harmony export */   MIME_TYPE_WASM: () => (/* binding */ MIME_TYPE_WASM)\n/* harmony export */ });\nconst MIME_TYPE_JAVASCRIPT = \"text/javascript\";\nconst MIME_TYPE_WASM = \"application/wasm\";\nconst CORE_VERSION = \"0.12.6\";\nconst CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/ffmpeg-core.js`;\nvar FFMessageType;\n(function (FFMessageType) {\n    FFMessageType[\"LOAD\"] = \"LOAD\";\n    FFMessageType[\"EXEC\"] = \"EXEC\";\n    FFMessageType[\"WRITE_FILE\"] = \"WRITE_FILE\";\n    FFMessageType[\"READ_FILE\"] = \"READ_FILE\";\n    FFMessageType[\"DELETE_FILE\"] = \"DELETE_FILE\";\n    FFMessageType[\"RENAME\"] = \"RENAME\";\n    FFMessageType[\"CREATE_DIR\"] = \"CREATE_DIR\";\n    FFMessageType[\"LIST_DIR\"] = \"LIST_DIR\";\n    FFMessageType[\"DELETE_DIR\"] = \"DELETE_DIR\";\n    FFMessageType[\"ERROR\"] = \"ERROR\";\n    FFMessageType[\"DOWNLOAD\"] = \"DOWNLOAD\";\n    FFMessageType[\"PROGRESS\"] = \"PROGRESS\";\n    FFMessageType[\"LOG\"] = \"LOG\";\n    FFMessageType[\"MOUNT\"] = \"MOUNT\";\n    FFMessageType[\"UNMOUNT\"] = \"UNMOUNT\";\n})(FFMessageType || (FFMessageType = {}));\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js":
/*!********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_IMPORT_FAILURE: () => (/* binding */ ERROR_IMPORT_FAILURE),\n/* harmony export */   ERROR_NOT_LOADED: () => (/* binding */ ERROR_NOT_LOADED),\n/* harmony export */   ERROR_TERMINATED: () => (/* binding */ ERROR_TERMINATED),\n/* harmony export */   ERROR_UNKNOWN_MESSAGE_TYPE: () => (/* binding */ ERROR_UNKNOWN_MESSAGE_TYPE)\n/* harmony export */ });\nconst ERROR_UNKNOWN_MESSAGE_TYPE = new Error(\"unknown message type\");\nconst ERROR_NOT_LOADED = new Error(\"ffmpeg is not loaded, call `await ffmpeg.load()` first\");\nconst ERROR_TERMINATED = new Error(\"called FFmpeg.terminate()\");\nconst ERROR_IMPORT_FAILURE = new Error(\"failed to import ffmpeg-core.js\");\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFmpeg: () => (/* reexport safe */ _classes_js__WEBPACK_IMPORTED_MODULE_0__.FFmpeg)\n/* harmony export */ });\n/* harmony import */ var _classes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js\");\n\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getMessageID: () => (/* binding */ getMessageID)\n/* harmony export */ });\n/**\n * Generate an unique message ID.\n */\nconst getMessageID = (() => {\n    let messageID = 0;\n    return () => messageID++;\n})();\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/util/dist/esm/const.js":
/*!*****************************************************!*\
  !*** ./node_modules/@ffmpeg/util/dist/esm/const.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   HeaderContentLength: () => (/* binding */ HeaderContentLength)\n/* harmony export */ });\nconst HeaderContentLength = \"Content-Length\";\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/util/dist/esm/const.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/util/dist/esm/errors.js":
/*!******************************************************!*\
  !*** ./node_modules/@ffmpeg/util/dist/esm/errors.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_INCOMPLETED_DOWNLOAD: () => (/* binding */ ERROR_INCOMPLETED_DOWNLOAD),\n/* harmony export */   ERROR_RESPONSE_BODY_READER: () => (/* binding */ ERROR_RESPONSE_BODY_READER)\n/* harmony export */ });\nconst ERROR_RESPONSE_BODY_READER = new Error(\"failed to get response body reader\");\nconst ERROR_INCOMPLETED_DOWNLOAD = new Error(\"failed to complete download\");\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/util/dist/esm/errors.js?");

/***/ }),

/***/ "./node_modules/@ffmpeg/util/dist/esm/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@ffmpeg/util/dist/esm/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   downloadWithProgress: () => (/* binding */ downloadWithProgress),\n/* harmony export */   fetchFile: () => (/* binding */ fetchFile),\n/* harmony export */   importScript: () => (/* binding */ importScript),\n/* harmony export */   toBlobURL: () => (/* binding */ toBlobURL)\n/* harmony export */ });\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.js */ \"./node_modules/@ffmpeg/util/dist/esm/errors.js\");\n/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./const.js */ \"./node_modules/@ffmpeg/util/dist/esm/const.js\");\n\n\nconst readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {\n    const fileReader = new FileReader();\n    fileReader.onload = () => {\n        const { result } = fileReader;\n        if (result instanceof ArrayBuffer) {\n            resolve(new Uint8Array(result));\n        }\n        else {\n            resolve(new Uint8Array());\n        }\n    };\n    fileReader.onerror = (event) => {\n        reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));\n    };\n    fileReader.readAsArrayBuffer(blob);\n});\n/**\n * An util function to fetch data from url string, base64, URL, File or Blob format.\n *\n * Examples:\n * ```ts\n * // URL\n * await fetchFile(\"http://localhost:3000/video.mp4\");\n * // base64\n * await fetchFile(\"data:<type>;base64,wL2dvYWwgbW9yZ...\");\n * // URL\n * await fetchFile(new URL(\"video.mp4\", import.meta.url));\n * // File\n * fileInput.addEventListener('change', (e) => {\n *   await fetchFile(e.target.files[0]);\n * });\n * // Blob\n * const blob = new Blob(...);\n * await fetchFile(blob);\n * ```\n */\nconst fetchFile = async (file) => {\n    let data;\n    if (typeof file === \"string\") {\n        /* From base64 format */\n        if (/data:_data\\/([a-zA-Z]*);base64,([^\"]*)/.test(file)) {\n            data = atob(file.split(\",\")[1])\n                .split(\"\")\n                .map((c) => c.charCodeAt(0));\n            /* From remote server/URL */\n        }\n        else {\n            data = await (await fetch(file)).arrayBuffer();\n        }\n    }\n    else if (file instanceof URL) {\n        data = await (await fetch(file)).arrayBuffer();\n    }\n    else if (file instanceof File || file instanceof Blob) {\n        data = await readFromBlobOrFile(file);\n    }\n    else {\n        return new Uint8Array();\n    }\n    return new Uint8Array(data);\n};\n/**\n * importScript dynamically import a script, useful when you\n * want to use different versions of ffmpeg.wasm based on environment.\n *\n * Example:\n *\n * ```ts\n * await importScript(\"http://localhost:3000/ffmpeg.js\");\n * ```\n */\nconst importScript = async (url) => new Promise((resolve) => {\n    const script = document.createElement(\"script\");\n    const eventHandler = () => {\n        script.removeEventListener(\"load\", eventHandler);\n        resolve();\n    };\n    script.src = url;\n    script.type = \"text/javascript\";\n    script.addEventListener(\"load\", eventHandler);\n    document.getElementsByTagName(\"head\")[0].appendChild(script);\n});\n/**\n * Download content of a URL with progress.\n *\n * Progress only works when Content-Length is provided by the server.\n *\n */\nconst downloadWithProgress = async (url, cb) => {\n    const resp = await fetch(url);\n    let buf;\n    try {\n        // Set total to -1 to indicate that there is not Content-Type Header.\n        const total = parseInt(resp.headers.get(_const_js__WEBPACK_IMPORTED_MODULE_1__.HeaderContentLength) || \"-1\");\n        const reader = resp.body?.getReader();\n        if (!reader)\n            throw _errors_js__WEBPACK_IMPORTED_MODULE_0__.ERROR_RESPONSE_BODY_READER;\n        const chunks = [];\n        let received = 0;\n        for (;;) {\n            const { done, value } = await reader.read();\n            const delta = value ? value.length : 0;\n            if (done) {\n                if (total != -1 && total !== received)\n                    throw _errors_js__WEBPACK_IMPORTED_MODULE_0__.ERROR_INCOMPLETED_DOWNLOAD;\n                cb && cb({ url, total, received, delta, done });\n                break;\n            }\n            chunks.push(value);\n            received += delta;\n            cb && cb({ url, total, received, delta, done });\n        }\n        const data = new Uint8Array(received);\n        let position = 0;\n        for (const chunk of chunks) {\n            data.set(chunk, position);\n            position += chunk.length;\n        }\n        buf = data.buffer;\n    }\n    catch (e) {\n        console.log(`failed to send download progress event: `, e);\n        // Fetch arrayBuffer directly when it is not possible to get progress.\n        buf = await resp.arrayBuffer();\n        cb &&\n            cb({\n                url,\n                total: buf.byteLength,\n                received: buf.byteLength,\n                delta: 0,\n                done: true,\n            });\n    }\n    return buf;\n};\n/**\n * toBlobURL fetches data from an URL and return a blob URL.\n *\n * Example:\n *\n * ```ts\n * await toBlobURL(\"http://localhost:3000/ffmpeg.js\", \"text/javascript\");\n * ```\n */\nconst toBlobURL = async (url, mimeType, progress = false, cb) => {\n    const buf = progress\n        ? await downloadWithProgress(url, cb)\n        : await (await fetch(url)).arrayBuffer();\n    const blob = new Blob([buf], { type: mimeType });\n    return URL.createObjectURL(blob);\n};\n\n\n//# sourceURL=webpack://ffmpeg-demo/./node_modules/@ffmpeg/util/dist/esm/index.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ffmpeg/ffmpeg */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js\");\n/* harmony import */ var _ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ffmpeg/util */ \"./node_modules/@ffmpeg/util/dist/esm/index.js\");\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _regeneratorRuntime() { \"use strict\"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = \"function\" == typeof Symbol ? Symbol : {}, a = i.iterator || \"@@iterator\", c = i.asyncIterator || \"@@asyncIterator\", u = i.toStringTag || \"@@toStringTag\"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, \"\"); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, \"_invoke\", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: \"normal\", arg: t.call(e, r) }; } catch (t) { return { type: \"throw\", arg: t }; } } e.wrap = wrap; var h = \"suspendedStart\", l = \"suspendedYield\", f = \"executing\", s = \"completed\", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { [\"next\", \"throw\", \"return\"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if (\"throw\" !== c.type) { var u = c.arg, h = u.value; return h && \"object\" == _typeof(h) && n.call(h, \"__await\") ? e.resolve(h.__await).then(function (t) { invoke(\"next\", t, i, a); }, function (t) { invoke(\"throw\", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke(\"throw\", t, i, a); }); } a(c.arg); } var r; o(this, \"_invoke\", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error(\"Generator is already running\"); if (o === s) { if (\"throw\" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if (\"next\" === n.method) n.sent = n._sent = n.arg;else if (\"throw\" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else \"return\" === n.method && n.abrupt(\"return\", n.arg); o = f; var p = tryCatch(e, r, n); if (\"normal\" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } \"throw\" === p.type && (o = s, n.method = \"throw\", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, \"throw\" === n && e.iterator[\"return\"] && (r.method = \"return\", r.arg = t, maybeInvokeDelegate(e, r), \"throw\" === r.method) || \"return\" !== n && (r.method = \"throw\", r.arg = new TypeError(\"The iterator does not provide a '\" + n + \"' method\")), y; var i = tryCatch(o, e.iterator, r.arg); if (\"throw\" === i.type) return r.method = \"throw\", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, \"return\" !== r.method && (r.method = \"next\", r.arg = t), r.delegate = null, y) : a : (r.method = \"throw\", r.arg = new TypeError(\"iterator result is not an object\"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = \"normal\", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: \"root\" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || \"\" === e) { var r = e[a]; if (r) return r.call(e); if (\"function\" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + \" is not iterable\"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, \"constructor\", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, \"constructor\", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, \"GeneratorFunction\"), e.isGeneratorFunction = function (t) { var e = \"function\" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || \"GeneratorFunction\" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, \"GeneratorFunction\")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, \"Generator\"), define(g, a, function () { return this; }), define(g, \"toString\", function () { return \"[object Generator]\"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = \"next\", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) \"t\" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if (\"throw\" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = \"throw\", a.arg = e, r.next = n, o && (r.method = \"next\", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if (\"root\" === i.tryLoc) return handle(\"end\"); if (i.tryLoc <= this.prev) { var c = n.call(i, \"catchLoc\"), u = n.call(i, \"finallyLoc\"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error(\"try statement without catch or finally\"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, \"finallyLoc\") && this.prev < o.finallyLoc) { var i = o; break; } } i && (\"break\" === t || \"continue\" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = \"next\", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if (\"throw\" === t.type) throw t.arg; return \"break\" === t.type || \"continue\" === t.type ? this.next = t.arg : \"return\" === t.type ? (this.rval = this.arg = t.arg, this.method = \"return\", this.next = \"end\") : \"normal\" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, \"catch\": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if (\"throw\" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error(\"illegal catch attempt\"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, \"next\" === this.method && (this.arg = t), y; } }, e; }\nfunction asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }\nfunction _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, \"next\", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, \"throw\", n); } _next(void 0); }); }; }\n\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  document.getElementById('cropBtn').onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {\n    var upload, ffmpeg, file, data, videoBlob, videoURL, outputVideo;\n    return _regeneratorRuntime().wrap(function _callee$(_context) {\n      while (1) switch (_context.prev = _context.next) {\n        case 0:\n          upload = document.getElementById('upload');\n          if (!(upload.files.length === 0)) {\n            _context.next = 4;\n            break;\n          }\n          alert(\"请先上传一个视频文件。\");\n          return _context.abrupt(\"return\");\n        case 4:\n          ffmpeg = new _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_0__.FFmpeg();\n          _context.next = 7;\n          return ffmpeg.load();\n        case 7:\n          // 确保 FFmpeg 被加载\n          file = upload.files[0];\n          _context.t0 = ffmpeg;\n          _context.next = 11;\n          return (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.fetchFile)(file);\n        case 11:\n          _context.t1 = _context.sent;\n          _context.next = 14;\n          return _context.t0.writeFile.call(_context.t0, 'input.mp4', _context.t1);\n        case 14:\n          _context.prev = 14;\n          _context.next = 17;\n          return ffmpeg.exec(['-i', 'input.mp4', '-f', 'null', '/dev/null']);\n        case 17:\n          _context.next = 19;\n          return ffmpeg.exec(['-i', 'input.mp4', '-vf', 'crop=640:480', 'output.mp4']);\n        case 19:\n          _context.next = 21;\n          return ffmpeg.readFile('output.mp4');\n        case 21:\n          data = _context.sent;\n          console.log(data); // 检查数据有效性\n          videoBlob = new Blob([data.buffer], {\n            type: 'video/mp4'\n          });\n          videoURL = URL.createObjectURL(videoBlob); // 撤销之前的 Blob URL（如果存在）\n          outputVideo = document.getElementById('outputVideo');\n          if (outputVideo.src) {\n            URL.revokeObjectURL(outputVideo.src);\n          }\n          outputVideo.src = videoURL;\n          _context.next = 34;\n          break;\n        case 30:\n          _context.prev = 30;\n          _context.t2 = _context[\"catch\"](14);\n          console.error(\"处理视频时发生错误:\", _context.t2);\n          alert(\"处理视频时发生错误，请检查文件格式或编码。\");\n        case 34:\n        case \"end\":\n          return _context.stop();\n      }\n    }, _callee, null, [[14, 30]]);\n  }));\n});\n\n//# sourceURL=webpack://ffmpeg-demo/./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"script": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;