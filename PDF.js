window.onload = function(){
    document.getElementById("download").addEventListener
    ("click",()=>{
        const content = this.document.getElementById("content");
        console.log(content);
        console.log(window);
        var opt={
            margin:1,
            filename: 'report.pdf',
            html2canvas: {scale:2},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().from(content).save();
    })
}