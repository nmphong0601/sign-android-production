/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 157:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findReleaseFiles = void 0;
const fs_1 = __importDefault(__nccwpck_require__(147));
function findReleaseFiles(releaseDir) {
    const releaseFiles = fs_1.default.readdirSync(releaseDir, { withFileTypes: true })
        .filter(item => !item.isDirectory())
        .filter(item => item.name.endsWith(".apk") || item.name.endsWith(".aab"));
    console.log("Found " + releaseFiles.length + " release files.");
    if (releaseFiles.length > 0) {
        return releaseFiles;
    }
}
exports.findReleaseFiles = findReleaseFiles;


/***/ }),

/***/ 730:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(714));
const signing_1 = __nccwpck_require__(739);
const path_1 = __importDefault(__nccwpck_require__(17));
const fs_1 = __importDefault(__nccwpck_require__(147));
const io = __importStar(__nccwpck_require__(157));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.DEBUG_ACTION === 'true') {
                core.debug("DEBUG FLAG DETECTED, SHORTCUTTING ACTION.");
                return;
            }
            const releaseDir = core.getInput('releaseDirectory');
            const signingKeyBase64 = core.getInput('signingKeyBase64');
            const alias = core.getInput('alias');
            const keyStorePassword = core.getInput('keyStorePassword');
            const keyPassword = core.getInput('keyPassword');
            console.log(`Preparing to sign key @ ${releaseDir} with signing key`);
            // 1. Find release files
            const releaseFiles = io.findReleaseFiles(releaseDir);
            if (releaseFiles !== undefined) {
                // 3. Now that we have a release files, decode and save the signing key
                const signingKey = path_1.default.join(releaseDir, 'signingKey.jks');
                fs_1.default.writeFileSync(signingKey, signingKeyBase64, 'base64');
                // 4. Now zipalign and sign each one of the the release files
                for (let releaseFile of releaseFiles) {
                    core.debug(`Found release to sign: ${releaseFile.name}`);
                    const releaseFilePath = path_1.default.join(releaseDir, releaseFile.name);
                    let signedReleaseFile = '';
                    if (releaseFile.name.endsWith('.apk')) {
                        signedReleaseFile = yield signing_1.signApkFile(releaseFilePath, signingKey, alias, keyStorePassword, keyPassword);
                    }
                    else if (releaseFile.name.endsWith('.aab')) {
                        signedReleaseFile = yield signing_1.signAabFile(releaseFilePath, signingKey, alias, keyStorePassword, keyPassword);
                    }
                    else {
                        core.error('No valid release file to sign, abort.');
                        core.setFailed('No valid release file to sign.');
                    }
                    core.debug('Release signed! Setting outputs.');
                    core.exportVariable("SIGNED_RELEASE_FILE", signedReleaseFile);
                    core.setOutput('signedReleaseFile', signedReleaseFile);
                }
                console.log('Releases signed!');
            }
            else {
                core.error("No release files (.apk or .aab) could be found. Abort.");
                core.setFailed('No release files (.apk or .aab) could be found.');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();


/***/ }),

/***/ 739:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.signAabFile = exports.signApkFile = void 0;
const exec = __importStar(__nccwpck_require__(64));
const core = __importStar(__nccwpck_require__(714));
const io = __importStar(__nccwpck_require__(829));
const path = __importStar(__nccwpck_require__(17));
const fs = __importStar(__nccwpck_require__(147));
function signApkFile(apkFile, signingKeyFile, alias, keyStorePassword, keyPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug("Zipaligning APK file");
        // Find zipalign executable
        const buildToolsVersion = process.env.BUILD_TOOLS_VERSION || '33.0.0';
        const androidHome = process.env.ANDROID_HOME;
        const buildTools = path.join(androidHome, `build-tools/${buildToolsVersion}`);
        if (!fs.existsSync(buildTools)) {
            core.error(`Couldnt find the Android build tools @ ${buildTools}`);
        }
        const zipAlign = path.join(buildTools, 'zipalign');
        core.debug(`Found 'zipalign' @ ${zipAlign}`);
        // Align the apk file
        const alignedApkFile = apkFile.replace('.apk', '-aligned.apk');
        yield exec.exec(`"${zipAlign}"`, [
            '-c',
            '-v', '4',
            apkFile
        ]);
        yield exec.exec(`"cp"`, [
            apkFile,
            alignedApkFile
        ]);
        core.debug("Signing APK file");
        // find apksigner path
        const apkSigner = path.join(buildTools, 'apksigner');
        core.debug(`Found 'apksigner' @ ${apkSigner}`);
        // apksigner sign --ks my-release-key.jks --out my-app-release.apk my-app-unsigned-aligned.apk
        const signedApkFile = apkFile.replace('.apk', '-signed.apk');
        const args = [
            'sign',
            '--ks', signingKeyFile,
            '--ks-key-alias', alias,
            '--ks-pass', `pass:${keyStorePassword}`,
            '--out', signedApkFile
        ];
        if (keyPassword) {
            args.push('--key-pass', `pass:${keyPassword}`);
        }
        args.push(alignedApkFile);
        yield exec.exec(`"${apkSigner}"`, args);
        // Verify
        core.debug("Verifying Signed APK");
        yield exec.exec(`"${apkSigner}"`, [
            'verify',
            signedApkFile
        ]);
        return signedApkFile;
    });
}
exports.signApkFile = signApkFile;
function signAabFile(aabFile, signingKeyFile, alias, keyStorePassword, keyPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug("Signing AAB file");
        const jarSignerPath = yield io.which('jarsigner', true);
        core.debug(`Found 'jarsigner' @ ${jarSignerPath}`);
        const args = [
            '-keystore', signingKeyFile,
            '-storepass', keyStorePassword,
        ];
        if (keyPassword) {
            args.push('-keypass', keyPassword);
        }
        args.push(aabFile, alias);
        yield exec.exec(`"${jarSignerPath}"`, args);
        return aabFile;
    });
}
exports.signAabFile = signAabFile;


/***/ }),

/***/ 714:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 64:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 829:
/***/ ((module) => {

module.exports = eval("require")("@actions/io");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(730);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;