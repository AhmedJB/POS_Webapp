import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { patchReq, postReq } from '../../utils/helper';
import { toast } from 'react-toastify';

export default function CategorieElement(props){

    const handleUpdate = async () => {
        let val = document.getElementById("name").value;
        if (val === props.cat.name){
            props.setSelectedCat(null);
        }else{
            let body = {
                name : val,
            }
            let resp = await patchReq("category/"+props.cat.id+"/",body);
            if (resp){
                toast.success("updated category");
                props.refresh();
            }else{
                toast.error("failed updating categories");
            }
        }
    }

    const html = <>
        {
            props.selectedCat === props.cat && <div className={props.styles.addHandlerContainer}>
            <input className={props.styles.addInput} defaultValue={props.cat.name} type="text" id="name" />
            <span onClick={handleUpdate} className={props.styles.IconContainer}>
                <DoneIcon className={props.styles.icon} />
            </span>
        </div>
        }

        {
            !(props.selectedCat === props.cat) && <div className={props.styles.ElementContainer}>
                <h3 className={props.styles.CatName}>{props.cat.name}</h3>
                <span onClick={() => props.setSelectedCat(props.cat)} className={props.styles.IconContainer}>
                    <EditIcon className={props.styles.icon} />
                </span>
            </div>
        }
    
    </>;

    return html;

}