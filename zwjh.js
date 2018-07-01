
var nowtask = "";
var interval = setInterval(function(){
	netProtocol.C2S_HEAL.sendMsg();
	netProtocol.C2S_ACCEPT_SCHOOL_TASK.sendMsg(InteractActionEnum.SHIMENRENWU);
	mess = ChatProxy.getInstance().promptMessageData;
	var mess_n = mess[mess.length-1]
	if(mess_n.data.length > 1)
	{
		if(mess_n.data[0].text.match('\\[师门任务\\]')!== null)
		{	
			var mtype = "";
			var mapid = [];
			var npcname = "";
			

			//检查任务类型并提取相关信息。
			for(j = 0,len = mess_n.data.length; j < len; j++) {
				
				//检查上个任务是否完成
				if(mess_n.data[j].text.match('本周完成：([0-9]*)/250'))
				{
					if(mess_n.data[j].text.match('本周完成：([0-9]*)/250')[1] == nowtask)
						return
					ntk = mess_n.data[j].text.match('本周完成：([0-9]*)/250')[1]
				}
				//传达消息的任务
				if(mess_n.data[j].text.match('亲口向其传达'))
				{
					mtype = "tellnpc";
					npcname = mess_n.data[j].text.match('「([^」]*)」')[1];
					if(npcname.length == 2)
					{
						npcname = npcname.split("").join("  ")
					}
					console.log(npcname)
				}
				//寻找物品的任务
				if(mess_n.data[j].text.match('在寻找'))
				{
					mtype = "findthings";
					npcname = mess_n.data[j].text.match('的(.*)在寻找')[1];
					if(npcname.length == 2)
					{
						npcname = npcname.split("").join("  ")
					}
					console.log(npcname)
				}
				if(mess_n.data[j].text.match('速去将之教训一番'))
				{
					mtype = "fightwithnpc";
					npcname = mess_n.data[j].text.match('「([^」]*)」')[1];
					if(npcname.length == 2)
					{
						npcname = npcname.split("").join("  ")
					}
					console.log(npcname)
				}
				//提取所有房间id
				if(mess_n.data[j].type === 3)
   				{
   					thingname = mess_n.data[j].text
   					mapid.push(mess_n.data[j].id)
   					console.log(mapid)
   					console.log(thingname)
   					//netProtocol.C2S_MAP_MIN.sendMsg(parseInt(mapid),!1);
   					//Components.DescConfig.miniMap[parseInt(mapid)];
   				}
   				
   			}
   			netProtocol.C2S_HEAL.sendMsg()
   			netProtocol.C2S_HEAL.sendMsg()
   			switch(mtype){
   				case "tellnpc":
   					mapid_ = mapid.shift();
   					for(var i = 1;i<=8;i++)
   						if(Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i]!= 0)
   							netProtocol.C2S_NPC_DIALOGUE.sendMsg(Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i])
   					nowtask = ntk;
   					break;
   				case "findthings":
   					thingroom = mapid.pop();
   					console.log("thingroom:" + thingroom)
   					//水母orz
   					if(thingname == '水母')
   					{

   						clearInterval(interval);
   						return;
   					}
   					for(var i = 1;i<=8;i++)
   					{		
   							//拿东西
   							if(Components.DescConfig.miniMap[parseInt(thingroom)]['actionID'+i]!=0 && 
   							(
   							Components.DescConfig.action[Components.DescConfig.miniMap[parseInt(thingroom)]['actionID'+i]].remark.startsWith(thingname)
   							|| Components.DescConfig.action[Components.DescConfig.miniMap[parseInt(thingroom)]['actionID'+i]].remark == "给予"
   							)
   							)
   							{
   								console.log("actionid:"+Components.DescConfig.miniMap[parseInt(thingroom)]['actionID'+i])
   								netProtocol.C2S_NPC_GIVE.sendMsg(Components.DescConfig.miniMap[parseInt(thingroom)]['actionID'+i])

   							}
   					}

   					//对话给东西
   					mapid_ = mapid.shift();
   					for(var i = 1;i<=8;i++)
   						if(Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i]!= 0)
   							netProtocol.C2S_NPC_DIALOGUE.sendMsg(Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i])
   					netProtocol.C2S_MAP_MIN.sendMsg(parseInt(thingroom),!1)
   					
   					break;
   				case "fightwithnpc":
   					mapid_ = mapid.shift();
   					netProtocol.C2S_MAP_MIN.sendMsg(parseInt(mapid_),!1)
   					for(var i = 1;i<=8;i++){
   						if(Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i]!= 0 && 
   							Components.DescConfig.getNPCDataById(Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i]).name == npcname){
   								netProtocol.C2S_BATTLE_KILL.sendMsg(1,Components.DescConfig.miniMap[parseInt(mapid_)]['NPCID'+i],2)
   								nowtask = ntk;
   								break;
   							}
   					
   					}

   					
   					break;

   				default:
 					clearInterval(interval);
   					break;
   			}
   			
			
		}
		else
		{
	
			return;
		}
	}
	else
	{

		return;
	}

}, 1000);




