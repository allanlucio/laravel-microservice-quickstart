import { isArray } from "util";

export default class FormDataHelper{

    fileFields: string[];
    formData: any[];
    isPut:boolean;
    constructor(formData,filesFields,isPut){
        this.formData=formData;
        this.fileFields=filesFields;
        this.isPut=isPut;
    }   
    public getFormData(): FormData{
        const fileFormData = new FormData();
        if(this.isPut)fileFormData.append('_method',"PUT");
        Object.keys(this.formData).forEach((key) => {
            const value =this.formData[key];

            if(this.rejectField(key, value)) return;
            
            if(isArray(value)){
                value.forEach(element=>{
                    fileFormData.append(key+"[]",element);
                })
            }else{
                fileFormData.append(key,this.formData[key]);
            }
            

        });
        return fileFormData
    }
    
    private rejectField(key,value){
        if (value == null || this.rejectFileField(key,value)){
            return true;
        }
        if(this.fileFields.find((file_field)=>file_field===key) && !(value instanceof File)){
            return;
        }
    }

    private rejectFileField(key,value){
        if(this.fileFields.find((file_field)=>file_field===key) && !(value instanceof File)){
            return true;
        }

        return false;
    }
    public getHeaders(){
        return {
            "Content-Type": `multipart/form-data;`,
           };
    }
    
        
        
}