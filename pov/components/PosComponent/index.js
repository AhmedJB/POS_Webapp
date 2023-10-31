import ContainerCard from "../General/ContainerCard";
import Header from "../Home/Header";
import styles from "../../styles/modular/PosComponent/PosComponent.module.css";
import { style } from "@mui/system";
import {useContext, useEffect, useState} from "react";
import { OpenInNewOff } from "@mui/icons-material";

// icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Categories from "./Categories";
import Products from "./Products";
import CartComp from "./CartComp";
import { AnimatePresence } from "framer-motion";
import Checker from "../General/Checker";
import { formatToday, postReq, req } from "../../utils/helper";
import {PosContext} from "../../contexts/points"
import { UserContext } from "../../contexts/user";
import { toast } from "react-toastify";
import PaymentComp from "./PaymentComp";
import { CartContext } from "../../contexts/cart";





export default function PosComponent(props){
	const [openCart,setOpenCart] = useState(false);
	const [selectedCat,setSelectedCat] = useState(0);
	const [cats,setCats] = useState([])
	const [orderStep ,setOrderStep] = useState("cart");
	const [orderReduction ,setOrderReduction] = useState(0);
	const [paid,setPaid] = useState(0);
	const [refresh,setRefresh] = useState(false);

	// confirmation state
	const [selectedClient,setSelectedClient] = useState(null);

	const {selectedPos,setSelectedPos} = useContext(PosContext);
	const {cartProducts,setCartProducts} = useContext(CartContext);
	const {user,setUser} = useContext(UserContext);

	// main logic

	useEffect(
		() => {
			fetchCategories().then(() => console.log("done with categories"));
		}, []
	)

	// fetch categories
	const fetchCategories = async () => {
		let resp = await req("category/?pid="+selectedPos.id)
		if (resp){
			toast.info("loaded categories");
			setCats(resp);
		}else{
			toast.error("failed loading categories");
		}
	}

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

	// execute order
	const execute = async () => {
		toast.info("Executing Order")
		let body = {
			products: cartProducts,
			total : calculateTotal(),
			reduction:orderReduction,
			paid,
			client:selectedClient.id,
			user : user.id,
			pos : selectedPos.id
		}
		console.log(body);
		let resp = await postReq("order/",body);
		if (resp){
			toast.success("order created")
		}else{
			toast.error("order issue")
		}
		clear();

	}

	const clear = () => {
		setOrderReduction(0);
		setCartProducts([]);
		setRefresh(!refresh);
		setSelectedClient(null);
		setOrderStep('cart')
	}

	return <> 
	<Checker>
	<ContainerCard>
				<Header location={"pos"} />


		{selectedPos && 
			<div className="right">
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.browserHeader}>
						<h1 className={"sectionTitle mb-4" }>{selectedPos.nom}</h1>
						<h3 className={"sectionSubTitle my-4 "}>{formatToday()}</h3>
						<hr className={styles.divider}></hr>
					</div>
					<Categories selectedCat={selectedCat} setSelectedCat={setSelectedCat} 
						cats = {cats}
					/>
					<Products refresh={refresh} selectedCat={selectedCat} cats={cats} />

				</div>
				<aside className={styles.cart + " " + (openCart ? "" : styles.closed)}>
					{!openCart && <span className={styles.handler} onClick={() => setOpenCart(!openCart)}> <ShoppingCartIcon className={styles.icon} /> </span> }
					<CloseIcon className={styles.close + ' ' + styles.icon} onClick={() => setOpenCart(false)} />

				<AnimatePresence>
				{
					orderStep == "cart" && 
					<CartComp setOrderStep={setOrderStep} setOrderReduction={setOrderReduction} orderReduction={orderReduction}/>
				}
				</AnimatePresence>
				<AnimatePresence>

				{
					orderStep == "confirmation" &&
					<PaymentComp setOrderStep={setOrderStep} execute={execute} cl={[selectedClient,setSelectedClient]}  orderReduction={orderReduction} pd={[paid,setPaid]} />
				}
				</AnimatePresence>
				


				</aside>
			</div>
			

		</div>
}

			</ContainerCard>
	</Checker>
			
		</>

}