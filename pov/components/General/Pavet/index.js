import {useState,useEffect} from 'react'
import styles from '../../../styles/modular/Pavet/Pavet.module.css'


export default function Pavet(props){
	const activenumber = (i) => {
		let elem = document.getElementById(props.inpId);
        console.log(elem);
        if (elem.value == "0"){
            elem.value = ""
        }
        if (i == "x"){
            elem.value = "0";
        }else if (i=="<"){
            if (elem.value.length > 1){
                elem.value = elem.value.substring(0,elem.value.length - 1);
            }else{
                elem.value = "0"
            }
            
        }else{
            elem.value += i
        }
	}

	const html = <>
		<div className={styles.numbers}>
            <button value="1" onClick={() =>  {activenumber(1)} }>1</button>
                <button value="2" onClick={() =>  {activenumber(2)} }>2</button>
                <button value="3"onClick={ () => { activenumber(3)} }>3</button>
                <button value="4"onClick={ () => {activenumber(4)} }>4</button>
                <button value="5"onClick={ () => {activenumber(5)} }>5</button>
                <button value="6"onClick={ () => {activenumber(6)} }>6</button>
                <button value="7"onClick={ () => {activenumber(7)} }>7</button>
                <button value="8"onClick={ () => {activenumber(8)} }>8</button>
                <button value="9"onClick={ () => {activenumber(9)} }>9</button>
                <button value="<="onClick={ () => {activenumber('<')} }>{"<"}</button>
                <button value="0"onClick={ () => {activenumber(0)} }>0</button>
                <button value="×" onClick={ () => {activenumber('x')} }>×</button>
            </div>
	</>

	return html;


}