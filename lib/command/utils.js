"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePackageLock = exports.copyCpackTemplate = exports.packageJsonGenerator = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
const path_2 = require("../utils/path");
const packageByTemplate = {
    common: {
        scripts: {
            'dev': 'npx cpack dev',
            'dev-server': 'npx cpack dev-server',
            'build': 'npx cpack build'
        },
        dependencies: [],
        devDependencies: ['husky', 'prettier', 'typescript', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'eslint-config-prettier', 'eslint']
    },
    react: {
        dependencies: ['react', 'react-dom'],
        devDependencies: ['@types/react', '@types/react-dom', 'eslint-plugin-react']
    },
    tools: {
        dependencies: [],
        devDependencies: []
    },
    components: {
        dependencies: [],
        devDependencies: []
    }
};
function packageJsonGenerator(config, callback) {
    const { type, packageManager } = config;
    const packageJson = (0, path_2.getPackageJson)();
    const isPackageJsonExists = fs_extra_1.default.existsSync(packageJson);
    if (!isPackageJsonExists) {
        console.info('初始化package.json文件');
        child_process_1.default.spawnSync(packageManager, ['init', '-y'], {
            shell: true
        });
    }
    console.info('往package.json注入执行脚本和相关依赖信息');
    const commonPackageTemplate = packageByTemplate['common'];
    const editJson = fs_extra_1.default.readJsonSync(packageJson);
    editJson.scripts = editJson.scripts || {};
    Object.assign(editJson.scripts, commonPackageTemplate.scripts);
    editJson &&
        fs_extra_1.default.writeJSONSync(packageJson, editJson, {
            spaces: '\t'
        });
    console.info('开始安装预置依赖');
    removePackageLock(packageManager);
    const currentDepPackage = [...commonPackageTemplate.dependencies, ...packageByTemplate[type].dependencies];
    const depSpawn = currentDepPackage && child_process_1.default.spawnSync(packageManager, ['add', ...currentDepPackage, '-S'], {
        shell: true
    });
    console.info(depSpawn === null || depSpawn === void 0 ? void 0 : depSpawn.stdout.toString());
    removePackageLock(packageManager);
    const currentDevPackage = [...commonPackageTemplate.devDependencies, ...packageByTemplate[type].devDependencies];
    const devSpawn = currentDevPackage && child_process_1.default.spawnSync(packageManager, ['add', ...currentDevPackage, '-D'], {
        shell: true
    });
    console.info(devSpawn === null || devSpawn === void 0 ? void 0 : devSpawn.stdout.toString());
    console.info('package.json创建完成');
    callback && callback();
}
exports.packageJsonGenerator = packageJsonGenerator;
function copyCpackTemplate(type, callback) {
    fs_extra_1.default.copy(path_1.default.resolve((0, path_2.getCtemplatePath)(), type), path_2.projectPath, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        callback && callback();
    });
}
exports.copyCpackTemplate = copyCpackTemplate;
function removePackageLock(packageManager) {
    const lockFile = {
        'npm': 'package-lock.json',
        'yarn': 'yarn.lock'
    };
    const packageLock = path_1.default.resolve(path_2.projectPath, `./${lockFile[packageManager]}`);
    if (fs_extra_1.default.existsSync(packageLock)) {
        fs_extra_1.default.unlinkSync(packageLock);
    }
}
exports.removePackageLock = removePackageLock;
