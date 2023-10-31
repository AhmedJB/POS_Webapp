import React , {useEffect,useState} from 'react'
import styles from "../../../styles/modular/Header/Header.module.css"
import Sidebar from '../../General/Sidebar';

// icons
import MenuIcon from '@mui/icons-material/Menu';

export default function Header(props){
	const [open,setOpen] = useState(false);
	return <>
	<nav className={styles.headerContainer}>
		<div className={styles.brand}>
			<h2>Jaeger Resto</h2>
			<h4>hello world</h4>
		</div>

		{!open && <div onClick={() => setOpen(true)} className={styles.hamburger}>
			<MenuIcon className={styles.ham} />

		</div> }



	</nav>
	<Sidebar active = {open} setActive = {setOpen} location={props.location} />
	
	</>
}