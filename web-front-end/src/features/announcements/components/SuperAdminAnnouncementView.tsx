'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Announcement, AnnouncementPriority } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';


const BADGE_STYLES: Record<string, {
  label:string;
  className:string;
  borderClass:string;
}> = {

  critical:{
    label:'CRITICAL',
    className:'bg-red-100 text-red-700',
    borderClass:'border-l-red-600'
  },

  emergency:{
    label:'CRITICAL',
    className:'bg-red-100 text-red-700',
    borderClass:'border-l-red-600'
  },

  info:{
    label:'INFO',
    className:'bg-blue-100 text-blue-700',
    borderClass:'border-l-blue-600'
  },

  update:{
    label:'UPDATE',
    className:'bg-purple-100 text-purple-700',
    borderClass:'border-l-purple-600'
  },

  feature:{
    label:'FEATURE',
    className:'bg-green-100 text-green-700',
    borderClass:'border-l-green-600'
  },

  normal:{
    label:'INFO',
    className:'bg-blue-100 text-blue-700',
    borderClass:'border-l-blue-600'
  }

};



function timeAgo(dateString:string){

const diff =
Date.now()-new Date(dateString).getTime();


const mins =
Math.floor(diff/(1000*60));


if(mins<1)
return "Just now";


if(mins<60)
return `${mins} mins ago`;


const hours =
Math.floor(mins/60);


if(hours<24)
return `${hours} hours ago`;


const days =
Math.floor(hours/24);


return `${days} days ago`;

}



type FilterTab =
'all'
|'critical'
|'info'
|'update'
|'feature';



export default function SuperAdminAnnouncementView(){


const [announcements,setAnnouncements]
=
useState<Announcement[]>([]);


const [filter,setFilter]
=
useState<FilterTab>('all');


const [isLoading,setIsLoading]
=
useState(true);


const [errorMessage,setErrorMessage]
=
useState('');



useEffect(()=>{


async function loadData(){

try{


const data =
await getAnnouncements();



const platformOnly =
data.filter(
(a)=>
a.postedBy.role==='super-admin'
);



setAnnouncements(platformOnly);



}
catch(error){


setErrorMessage(
error instanceof Error
?
error.message
:
'Failed to load announcements'
);


}
finally{

setIsLoading(false);

}


}


loadData();


},[]);





const filtered =
announcements.filter((a)=>{


if(filter==='all')
return true;


return a.priority.toLowerCase()===filter;


});



if(isLoading){

return (

<p className="text-gray-500 text-sm p-6">

Loading platform announcements...

</p>

);

}



if(errorMessage){

return (

<p className="text-red-600 text-sm p-6">

{errorMessage}

</p>

);

}



return (

<div className="max-w-5xl mx-auto space-y-6">



{/* HEADER */}


<div className="flex items-start justify-between">


<div>

<h1 className="text-2xl font-bold text-gray-900">

Platform Announcements

</h1>


<div className="flex items-center gap-2 mt-2">


<span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">


<span className="w-2 h-2 rounded-full bg-blue-600"/>


{announcements.length} Announcements


</span>


<span className="text-sm text-gray-500">

Real-time platform communication

</span>


</div>


</div>




<Link

href="/announcements/super-admin-compose"

className="bg-blue-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-900"

>

+ New Announcement

</Link>


</div>





{/* FILTER BUTTONS */}


<div className="flex flex-wrap gap-3">


{

(
[
'all',
'critical',
'info',
'update',
'feature'
] as FilterTab[]

).map((tab)=>(


<button


key={tab}


onClick={()=>setFilter(tab)}


className={`
px-4 py-2 rounded-full text-sm font-medium capitalize transition

${
filter===tab
?
'bg-blue-950 text-white'
:
'bg-gray-100 text-gray-600 hover:bg-gray-200'
}

`}


>


{tab}


</button>


))


}



</div>






{/* ANNOUNCEMENTS */}



<div className="space-y-4">



{

filtered.length===0 && (

<p className="text-sm text-gray-400 text-center py-10">

No announcements found.

</p>

)

}




{

filtered.map((a)=>{


const badge =
BADGE_STYLES[a.priority]
||
BADGE_STYLES.info;



return (

<div

key={a.id}

className={`
bg-white
border
border-gray-200
rounded-lg
p-5
border-l-4
${badge.borderClass}
hover:shadow-md
transition
`}


>



<div className="flex justify-between items-start">


<span

className={`
inline-block
text-xs
font-semibold
px-3
py-1
rounded-full
${badge.className}
`}

>

{badge.label}

</span>



<span className="text-xs text-gray-400">

{timeAgo(a.publishDate)}

</span>



</div>




<h2 className="text-lg font-bold text-gray-900 mt-3">

{a.title}

</h2>



<p className="text-sm text-gray-600 mt-2 leading-relaxed">

{a.content}

</p>




<div className="mt-4 pt-3 border-t flex justify-between">


<span className="text-xs text-gray-400">

{a.source || 'Platform'}

</span>


<span className="text-xs text-gray-400">

Super Admin

</span>


</div>



</div>


);


})


}



</div>



</div>


);


}