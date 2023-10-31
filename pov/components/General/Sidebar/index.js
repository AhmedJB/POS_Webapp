import { useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import styles from "../../../styles/modular/Sidebar/Sidebar.module.css"

import Store from "../../../assets/sidebar/Store.svg"


import Image from "next/image";

// icoons
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AssessmentIcon from '@mui/icons-material/Assessment';


import { UserContext } from "../../../contexts/user";
import { logout } from "../../../utils/helper";
import Link from "next/link";
import { PosContext } from "../../../contexts/points";


export default function Sidebar(props) {
	const { user, setUser } = useContext(UserContext);
	const { data, setData } = useContext(PosContext);
	const { selectedPos, setSelectedPos } = useContext(PosContext);





	const html = <>
		<aside className={styles.sideContainer + " left " + (props.active ? styles.open : styles.closed)}>
			<CloseIcon className={styles.close} onClick={() => props.setActive(false)} />
			<span className={styles.store}>
				<Image src={Store} width={50} height={50} />
			</span>

			<ul className={styles.linksContainer} >
				<Link href="/app/overview">
					<div className={styles.linkContainer + " " + (props.location == "overview" ? styles.linkContainerActive : "")}>
						<div className={styles.iconContainer}>
							<DashboardIcon className={styles.icon} />
						</div>
						<h1 className={styles.title}>
							Dashboard
						</h1>
					</div>
				</Link>
				{
					selectedPos && user && <>
						<Link href="/app/pos">
							<div className={styles.linkContainer + " " + (props.location == "pos" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<SellIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Commandes
								</h1>

							</div>
						</Link>
						{
							['super','admin'].includes(user.role) && <> 
								<Link href="/app/stats">
							<div className={styles.linkContainer + " " + (props.location == "stats" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<AssessmentIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Commandes
								</h1>

							</div>
						</Link>


						<Link href="/app/stock">
							<div className={styles.linkContainer + " " + (props.location == "stock" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<InventoryIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Stock
								</h1>
							</div>
						</Link>

						<Link href="/app/adduser">
							<div className={styles.linkContainer + " " + (props.location == "addUser" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<PersonAddIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Add Users
								</h1>

							</div>
						</Link>

						<Link href="/app/addclient">
							<div className={styles.linkContainer + " " + (props.location == "addClient" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<GroupIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Add Clients
								</h1>

							</div>
						</Link>
						<Link href="/app/supplier">
							<div className={styles.linkContainer + " " + (props.location == "addSupplier" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<ContactPageIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Add Clients
								</h1>

							</div>
						</Link>
						<Link href="/app/adddepot">
							<div className={styles.linkContainer + " " + (props.location == "addDepot" ? styles.linkContainerActive : "")}>
								<div className={styles.iconContainer}>
									<WarehouseIcon className={styles.icon} />
								</div>
								<h1 className={styles.title}>
									Add Clients
								</h1>

							</div>
						</Link>
							</>
						}
						
					</>
				}





			</ul>



			<span onClick={() => logout(setUser, setData, setSelectedPos)} className={styles.logoutContainer}>
				<LogoutIcon className={styles.icon} />
			</span>
		</aside>

	</>



	return html;




}