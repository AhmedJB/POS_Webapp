import {useState,useContext} from "react"
import { CartContext } from "../../../contexts/cart";
import styles from "../../../styles/modular/CartProduct/CartProduct.module.css"
import Image from "next/image"
import {trim} from '../../../utils'

// icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";


export default function CartProduct(props){
	const {cartProducts,setCartProducts} = useContext(CartContext);
	const {prod,index,key,setSelectedId} = props;

	const deleteProd = (index) => {
		let temp = [...cartProducts];
		temp.splice(index,1);
		setCartProducts(temp);
	}

	const modifyQuant = (index,step) => {
		let temp = [...cartProducts];
		if (temp[index].quantity_com + step > temp[index].quantity){
			toast.info("can't add more");
		}else if (temp[index].quantity_com + step <= 0 ){
			deleteProd(index);
		}else{
			temp[index].quantity_com += step;
			setCartProducts(temp);
		}
	}

	const addReduction = (index,e,redirected=false) => {
		let temp = [...cartProducts];
		let red;
		if (redirected){
			red = e.value;
		}else{
			red = e.target.value;
		}
		
		temp[index].reduction = Number(red);
		console.table(temp);
		setCartProducts(temp);
	}

	const validateReduction = (index) => {
		let inp = document.getElementById("p-"+index);
		addReduction(index,inp,true);
	}

	const html = <>
		<article key={key} className={styles.container}>
			<div className={styles.infoSection}>
				<div className={styles.imageContainer}>
					<Image src={prod.image} width={50} height={50} className={styles.image}  />
				</div>
				<div className={styles.productInfo}>
					<h1 className={styles.productTitle}>
						{ trim(prod.name,40) }
					</h1>
					<div className={styles.pricingSection}>
						<p className={styles.price}>{prod.prix_unitaire} DH</p>
						<p className={styles.total}>{(prod.prix_unitaire * prod.quantity_com) * (1 - (prod.reduction / 100))} DH</p>
					</div>

				</div>
			</div>
			<div className={styles.controlSection}>
				<div className={styles.reductionContainer}>
				<input id={"p-"+index} onClick={(e) => setSelectedId(e.target.id) } className={styles.productDiscount} onChange={(e) => addReduction(index,e) }  value={prod.reduction} placeholder={"Reduction"}></input>
				<span onClick={() => validateReduction(index)} className={styles.validate}>
					<DoneIcon className={styles.icon}></DoneIcon>
				</span>
				</div>
				
				<div className={styles.controlContainer}>
				<span onClick={() => modifyQuant(index,-1)} className={styles.validate}>
					<RemoveIcon className={styles.icon}></RemoveIcon>
				</span>
				<span className={styles.quantityView}>{prod.quantity_com}</span>
				<span onClick={() => modifyQuant(index,1)} className={styles.validate}>
					<AddIcon className={styles.icon}></AddIcon>
				</span>
				<span onClick={() => {deleteProd(index)}} className={styles.delete}>
					<DeleteIcon className={styles.iconDelete}></DeleteIcon>
				</span>


				</div>
			</div>
		</article>
	</>

	return html;
}