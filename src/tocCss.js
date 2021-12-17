const tocCss = () => {
  return `
    .tocBoard {
        display: flex;
        flex-direction: column;
        padding: 1em;
        border: 1px dashed #C0C0C0;
      }
  
      .toc {
        margin-top: 0 !important;
      }
  
      .headerOne {
        border-top: 1px solid #C0C0C0;
        border-bottom: 1px solid #C0C0C0;
        margin-top: 3px;
        padding: 0 1em;
      }
  
      .headerTwo {
        margin-top: 3px;
        display: list-item;          
        list-style-type: disc;       
        list-style-position: inside; 
        padding: 0 1em;
      }
  
      .headerOne:hover, .headerTwo:hover {
        cursor: pointer;
        border: 1px dashed red;
      }
  
      .ti-arrow-bar-right:hover {
        cursor: pointer;
      }
      `;
};

export default tocCss;
