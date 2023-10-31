import {useState,useEffect} from "react";

import styles from  "../../../styles/modular/Categories/Categories.module.css"

export default function Categories(props){
	
	const html = <>
		<div className={styles.catSection}>
			<h1 className="sectionTitle">Categories</h1>
			<div className={styles.categoriesContainer}>
			<div key={-1}  onClick={() => props.setSelectedCat(null)} className={styles.cat  + " shad " + ( !props.selectedCat ? styles.active :  "" )}>
								All
							</div>
				{props.cats.map((e,i) => {
					return <div key={i}  onClick={() => props.setSelectedCat(e)} className={styles.cat  + " shad " + ( e.id == props.selectedCat?.id ? styles.active :  "" )}>
								{e.name}
							</div>
				})}
			</div>
		</div>

	</>


	return html;
}