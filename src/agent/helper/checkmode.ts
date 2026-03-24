import { modes } from "../type/mode.type"
import { pdf_prompt } from "../prompts/pdf.prompt"
import { research } from "../prompts/research"
import {testPrompt} from "../prompts/test.prompt"
import {TeacherAssistantPrompt} from "../prompts/teacherAssestent"

export function checkMode(mode: modes ) {
    
    if (mode === modes.pdf) {
        return pdf_prompt
    } else if (mode === modes.research) {
        return research
    }else if (mode === modes.test){
       return testPrompt
    }else{
        return TeacherAssistantPrompt
    }

}
