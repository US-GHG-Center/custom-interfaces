import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

export function UrbanSelector({urbanRegion, setUrbanRegion}) {
  const urbanRegions = ["Los Angeles", "New York", "San Fransisco", "Indianapolis", "Chicago", "SLC"]

  const clickHandler = (urbanRegion) => {
    setUrbanRegion(urbanRegion);
  };

  // return (
  //   <PopupState variant="popover" popupId="demo-popup-menu">
  //     {(popupState) => (
  //       <React.Fragment>
  //         <Button {...bindTrigger(popupState)}>
  //           {urbanRegion}
  //         </Button>
  //         <Menu {...bindMenu(popupState)}>
  //           { urbanRegions.map((urbanRegion) => (
  //             <MenuItem onClick={
  //               (event) => {
  //                 clickHandler(event.target.innerText);
  //                 popupState.close();
  //               }
  //             }>{urbanRegion}</MenuItem>
  //           ))}
  //         </Menu>
  //       </React.Fragment>
  //     )}
  //   </PopupState>
  // );

  return (
    <React.Fragment>
      <Button>
        {urbanRegion}
      </Button>
    </React.Fragment>
  );
}