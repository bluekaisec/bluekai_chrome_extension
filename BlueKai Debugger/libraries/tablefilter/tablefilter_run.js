console.log('LOG : tablefilter');
var tf = new TableFilter(document.querySelector('#request-table'), {
    base_path: 'libraries/tablefilter/'    
});
tf.init();