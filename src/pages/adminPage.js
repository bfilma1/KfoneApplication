import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ServicesComponent from '../components/ServicesComponent/Services'
import AdminDisplayComponent from '../components/DisplayComponent/AdminDisplayComponent';
import AdminOnlyPage from '../components/DisplayComponent/AdminOnlyPage';

function AdminPage() {
    const [activeButton, setActiveButton] = useState('display');
    const { data: session, status } = useSession()
    const [isAdmin, setIsAdmin] = useState(true);

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const buttons = [
        <Button className='btn-services' onClick={() => handleButtonClick('display')}>Display</Button>,
        <Button className='btn-services' onClick={() => handleButtonClick('services')}>Services</Button>,
        <Button className='btn-services' onClick={() => handleButtonClick('promotions')} >Promotions</Button>,
    ];

    let content = null;

    switch (activeButton) {
        case 'display':
            content = <AdminDisplayComponent />;
            break;
        case 'services':
            content = <ServicesComponent />;
            break;
        case 'promotions':
            // content = <PromotionsComponent />;
            break;
        default:
            content = null;
    }

    useEffect(() => {

        if(session){
            async function checkUser(){
                const response = await fetch('http://localhost:3000/api/userInfo');
                const json = await response.json();
                if(json.data["groups"].includes("admin")) {
                  setIsAdmin(true)
                }
                return JSON.stringify(json);
              }
          
              const userDetails = checkUser();
        } else {
            setIsAdmin(false);
        }
    

      }, []); 

    return (
        isAdmin ? (
        <div className='div-services' style={{display:'flex', flexDirection:'row'}}>
            <div className='btn-services-container'>
            <ButtonGroup aria-label="medium secondary button group" style={{display:'flex', flexDirection:'column'}}>
                {buttons}
            </ButtonGroup>
                {/* <button className='btn-services' onClick={() => handleButtonClick('display')}>Display</button>
                <button className='btn-services' onClick={() => handleButtonClick('services')}>Services</button>
                <Icon className='btn-service' onClick={() => handleButtonClick('add-to-cart')} >
                <ShoppingCartIcon />
                </Icon> */}
            </div>
            <div className='content-container'>
            {content}
            </div>
        </div>
        ) : (
            <AdminOnlyPage></AdminOnlyPage>
    ));
}

export default AdminPage;