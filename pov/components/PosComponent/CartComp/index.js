import {useEffect,useState,useContext} from "react";
import { CartContext } from "../../../contexts/cart";
import styles from "../../../styles/modular/CartComp/CartComp.module.css"
import {motion} from "framer-motion"
import CartProduct from "../CartProduct";
import Pavet from "../../General/Pavet";
import DoneIcon from '@mui/icons-material/Done';


export default function CartComp(props){
	const {cartProducts,setCartProducts} = useContext(CartContext);

	const cartAnimation = {
		initial : {
			opacity:0,
			y: "-50%"
		},
		enter : {
			opacity  : 1,
			y : 0,
			transition:{
				duration:.5
			}
		},
		exit : {
			opacity : 0,
			transition:{
				duration:.5
			}
		}
	}
	const [selectedId,setSelectedId] = useState(null);
	function calculateTotal(){
		let total = 0;
		total = cartProducts.map((e,i) => {
			console.log(e);
			return (e.prix_unitaire * e.quantity_com) * (1 - (e.reduction / 100))
		})

		total = total.reduce((pv, cv) => pv + cv, 0);
		console.log(total)
		return total
	}

	const validateReduction = () => {
		let inp = document.getElementById("reduction");
		let val = inp.value;
		props.setOrderReduction(Number(val))
	}

	const html = <>
	<motion.div
		variants={cartAnimation}
		className={styles.cartContainer}
		initial={"initial"}
		animate = {"enter"}
		exit = {"exit"}
	>
		<div className={styles.cartTitleContainer}>
		<h1 className={'sectionTitle ' + styles.cartTitle}>Order Overview</h1>
		</div>

		<div className={styles.productsSection}>
			<h1 className={styles.cartSubTitle}>
				Products
			</h1>
			<div className={styles.productsContainer}>
				{cartProducts.map((e,i) => {
					return <CartProduct setSelectedId={setSelectedId} prod={e} index={i} key={i} />
				})}

			</div>

		</div>

		<div className={styles.cartFooter}>
			<div className={styles.pavetContainer}>
			<Pavet inpId={selectedId} />
			<div className={styles.overview}>
				<div className="flex items-center my-4">
				<input className={styles.productDiscount} id={"reduction"} onClick={() => setSelectedId("reduction")} onChange = {(e) => props.setOrderReduction(Number(e.target.value))} value={props.orderReduction} placeholder={"Reduction"}></input>
				<span onClick={validateReduction} className={styles.validate}>
					<DoneIcon className={styles.icon}></DoneIcon>
				</span>
				</div>
				<p className={styles.footTitle}>Discount : <span className={styles.footValue}>{calculateTotal() * props.orderReduction / 100} DH</span></p>
				<p className={styles.footTitle}>Total : <span className={styles.footValue}>{ calculateTotal() * ( 1 - props.orderReduction / 100) } DH</span></p>
			
			</div>
			</div>
			
			
			
		</div>
		<div onClick={() => props.setOrderStep("confirmation")} className={'grid place-items-center w-full '+ styles.button   }>
			<button  className="submit w-3/4 mx-auto">Continue</button>
			</div>
		


	</motion.div>
			

	 </>



	return html;




}