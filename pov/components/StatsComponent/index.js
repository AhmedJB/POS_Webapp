import ContainerCard from "../General/ContainerCard";
import Header from "../Home/Header";
import styles from "../../styles/modular/Stats/Stats.module.css";
import {useContext, useEffect, useState} from "react";
import {PosContext} from "../../contexts/points"
import { UserContext } from "../../contexts/user";
import Checker from "../General/Checker";
import { formatToday } from "../../utils/helper";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import TextField from "@mui/material/TextField";
import OrderComponent from "./OrderComponent";
import AchatComponent from "./AchatComponent";
import StockComponent from "./StockComponent";
import OperationComponent from "./OperationComponent";


export default function Statscomponent(props){
    const {selectedPos,setSelectedPos} = useContext(PosContext);
	const {user,setUser} = useContext(UserContext);
    const [selectedTab,setSelectedTab] = useState("orders");

    // dates
    const [fromDate, setFromDate] = useState(new Date((new Date()).setHours(0, 0, 0, 0)));
    const [toDate, setToDate] = useState(
        new Date(fromDate.getTime() + 3600 * 24 * 1000)
    );

    const handleSelect = (event) => {
        setSelectedTab(event.target.value);
    }

    function handleDateChange(t, side) {
        console.log(t);
        switch (side) {
          case "from":
            setFromDate( new Date( t.setHours(0, 0, 0, 0) ));
            break;
          case "to":
            setToDate( new Date(t.setHours(0, 0, 0, 0)));
            break;
        }
      }

    return <> 
	<Checker>
	<ContainerCard>
				<Header location={"stats"} />


		{selectedPos && 
			<div className="right">
				<div className={styles.main}>
					<div className={styles.browserHeader}>
						<h1 className={"sectionTitle mb-4" }>{selectedPos.nom}</h1>
						<div className={styles.selectorSection}>
                            <select onChange={handleSelect} className={styles.tabSelector}>
                                <option value="orders" selected={selectedTab == "orders"}>Orders</option>
                                <option value="achat" selected={selectedTab == "achat"}>Achats</option>
                                <option value="stock" selected={selectedTab == "stock"}>Stock Changes</option>
                                <option value="operations" selected={selectedTab == "operations"} >Operations</option>
                            </select>

                            <div className={styles.DateSelectors}>
                            <div className={styles.dateContainer}>
                            <MobileDatePicker
                                label="From Date"
                                inputFormat="dd/MM/yyyy"
                                value={fromDate}
                                onChange={(v) => handleDateChange(v, "from")}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </div>
                            
                            <div className={styles.dateContainer}>
                        <MobileDatePicker
                                label="To Date"
                                inputFormat="dd/MM/yyyy"
                                value={toDate}
                                onChange={(v) => handleDateChange(v, "to")}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                              </div>

                            </div>
                        </div>
						<hr className={styles.divider}></hr>
					</div>

                    {
                        selectedTab === "orders" && <OrderComponent from={fromDate} to={toDate} />
                    }

                    {
                        selectedTab === "achat" && <AchatComponent from={fromDate} to={toDate} />
                    }
                    {
                        selectedTab === "stock" && <StockComponent from={fromDate} to={toDate} />
                    }
                    {
                        selectedTab === "operations" && <OperationComponent from={fromDate} to={toDate} />
                    }


				</div>
		</div>
}

			</ContainerCard>
	</Checker>
			
		</>


}