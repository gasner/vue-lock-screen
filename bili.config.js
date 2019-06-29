module.exports = {
    banner: true,
    input: 'src/index.js',
    output: {
        moduleName: 'LockScreenTemplate',
        extractCSS: false,
        minify:true,
        name: 'LockScreenTemplate',
        exports: 'named',
        format: ['esm', 'umd', 'cjs']
    },
    
    plugins: {
        commonjs:true,
        vue:{
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        },
        buble:true
    }
};