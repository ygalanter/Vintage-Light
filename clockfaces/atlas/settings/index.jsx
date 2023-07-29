function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Vintage Light</Text>}>
      
       
              <Select
                label={`Left Complication`}
                settingsKey="complication1"
                options={[
                  {name:"Battery charge", value:"battery"},
                  {name:"Minutes Active", value:"activeMinutes"},
                  {name:"Calories Burned", value:"calories"},
                  {name:"Distance Walked", value:"distance"},
                  {name:"Floors Climbed", value:"elevationGain"},
                  {name:"Step Count", value:"steps"}
                ]}
       />  
        
        
              <Select
                label={`Right Comlpication`}
                settingsKey="complication2"
                options={[
                  {name:"Battery charge", value:"battery"},
                  {name:"Minutes Active", value:"activeMinutes"},
                  {name:"Calories Burned", value:"calories"},
                  {name:"Distance Walked", value:"distance"},
                  {name:"Floors Climbed", value:"elevationGain"},
                  {name:"Step Count", value:"steps"}
                ]}
       />  
        
        
        
      </Section>
      
       <Section title={<Text bold align="center">Donate!</Text>}>
      
      <Text italic>If you like this clockface and would like to see it further developed as well as other wonderful Ionic apps and faces created, please know - I run on coffee. It's an essential fuel for inspiration and creativity. So feel free to donate so I won't run out of fuel :) Thanks!
         </Text>
      
      <Link source="https://paypal.me/yuriygalanter">YURIY'S COFFEE FUND</Link> 
         
         </Section>   

     
    </Page>
  );
}

registerSettingsPage(mySettings);