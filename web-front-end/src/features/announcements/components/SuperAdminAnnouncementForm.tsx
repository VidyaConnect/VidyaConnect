'use client';

import { useState } from 'react';
import {
  AnnouncementPriority,
  CreateAnnouncementInput
} from '../types/announcement';

import { createAnnouncement } from '../services/announcementService';


const TYPE_OPTIONS: {
  value: AnnouncementPriority;
  label: string;
  dot: string;
  activeClasses: string;
  badgeClasses: string;
}[] = [

  {
    value: 'info',
    label: 'Info',
    dot: 'bg-blue-500',
    activeClasses:
      'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600',
    badgeClasses:
      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
  },

  {
    value: 'update',
    label: 'Update',
    dot: 'bg-purple-500',
    activeClasses:
      'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600',
    badgeClasses:
      'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
  },


  {
    value: 'critical',
    label: 'Critical',
    dot: 'bg-red-500',
    activeClasses:
      'border-red-600 bg-red-50 text-red-700 ring-1 ring-red-600',
    badgeClasses:
      'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
  },


  {
    value: 'feature',
    label: 'Feature',
    dot: 'bg-green-500',
    activeClasses:
      'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600',
    badgeClasses:
      'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
  }

];


const MAX_CONTENT_LENGTH = 2000;


const COMPOSE_TIPS = [

  'Keep titles short and clear so they display properly on all devices.',

  'Use Critical announcements only for important platform messages.',

  'Put the most important information at the beginning.',

  'Review your message before broadcasting to all schools.'

];



export default function SuperAdminAnnouncementForm() {


  const [title,setTitle] =
    useState('');


  const [content,setContent] =
    useState('');


  const [priority,setPriority] =
    useState<AnnouncementPriority>('info');


  const [isSubmitting,setIsSubmitting] =
    useState(false);


  const [successMessage,setSuccessMessage] =
    useState('');


  const [errorMessage,setErrorMessage] =
    useState('');



  async function handleSubmit(e:React.FormEvent){

    e.preventDefault();


    setSuccessMessage('');
    setErrorMessage('');



    if(!title.trim()){

      setErrorMessage(
        'Announcement title is required.'
      );

      return;

    }



    if(!content.trim()){

      setErrorMessage(
        'Announcement content is required.'
      );

      return;

    }




    const input:CreateAnnouncementInput = {

      title:title.trim(),

      content:content.trim(),

      priority,

      targetAudience:'all-schools',

      requireReadConfirmation:false,

      distributionTags:[
        'Global Network'
      ]

    };



    setIsSubmitting(true);



    try{


      await createAnnouncement(input);



      setSuccessMessage(
        'Announcement broadcast successfully!'
      );


      setTitle('');

      setContent('');

      setPriority('info');



    }
    catch(error){


      setErrorMessage(

        error instanceof Error

        ?

        error.message

        :

        'Failed to send announcement.'

      );


    }
    finally{


      setIsSubmitting(false);


    }


  }




  const activeType =
    TYPE_OPTIONS.find(
      item=>item.value===priority
    )
    ??
    TYPE_OPTIONS[0];




  return (

    <div className="mx-auto w-full max-w-6xl">


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">


        {/* MAIN FORM */}

        <div className="lg:col-span-2">


          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">


            <div
              className={`h-1.5 w-full ${activeType.dot}`}
            />



            <div className="p-6 sm:p-8">



              <div className="mb-8 flex items-start gap-3">


                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">


                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 20h9"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                    />

                  </svg>


                </div>



                <div>


                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">

                    Create New System Announcement

                  </h1>



                  <p className="mt-1 text-sm text-gray-500">

                    Broadcast important messages across all schools.

                  </p>


                </div>



              </div>





              <form
                onSubmit={handleSubmit}
                className="space-y-7"
              >




                <div>


                  <label className="mb-1.5 block text-sm font-medium text-gray-700">

                    Announcement Title

                  </label>



                  <input

                    type="text"

                    value={title}

                    onChange={
                      e=>setTitle(e.target.value)
                    }


                    placeholder="e.g. Scheduled platform maintenance notice"


                    className="w-full rounded-lg border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:border-[#1B2559] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2559]/15"

                  />


                </div>
                                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Announcement Type
                  </label>


                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">


                    {TYPE_OPTIONS.map((opt)=>(
                      
                      <button

                        type="button"

                        key={opt.value}

                        onClick={() =>
                          setPriority(opt.value)
                        }


                        className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                          
                          priority === opt.value

                          ?

                          opt.activeClasses

                          :

                          'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'

                        }`}

                      >


                        <span
                          className={`h-2 w-2 rounded-full ${opt.dot}`}
                        />


                        {opt.label}


                      </button>


                    ))}


                  </div>


                </div>





                <div>


                  <label className="mb-2 block text-sm font-medium text-gray-700">

                    Distribution Network

                  </label>



                  <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">


                    <div className="flex items-center justify-between">


                      <div>


                        <p className="text-sm font-medium text-gray-900">

                          Global Network

                        </p>


                        <p className="mt-1 text-xs text-gray-500">

                          This announcement will be visible to all registered schools.

                        </p>


                      </div>



                      <div className="flex h-9 items-center rounded-full bg-blue-100 px-3">


                        <span className="h-2 w-2 rounded-full bg-blue-600 mr-2"/>


                        <span className="text-xs font-medium text-blue-700">

                          All Schools

                        </span>


                      </div>


                    </div>


                  </div>


                </div>





                <div>


                  <div className="mb-1.5 flex items-center justify-between">


                    <label className="block text-sm font-medium text-gray-700">

                      Message Content

                    </label>


                    <span

                      className={`text-xs ${
                        
                        content.length > MAX_CONTENT_LENGTH

                        ?

                        'text-red-500'

                        :

                        'text-gray-400'

                      }`}

                    >

                      {content.length}/{MAX_CONTENT_LENGTH}

                    </span>


                  </div>





                  <textarea


                    value={content}


                    onChange={
                      e=>setContent(e.target.value)
                    }


                    rows={8}


                    placeholder="Write your system announcement here..."


                    className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1B2559] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2559]/15"


                  />


                </div>






                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">


                  <div className="flex items-start gap-3">


                    <svg

                      xmlns="http://www.w3.org/2000/svg"

                      className="mt-0.5 h-5 w-5 text-blue-600"

                      fill="none"

                      viewBox="0 0 24 24"

                      stroke="currentColor"

                    >

                      <path

                        strokeLinecap="round"

                        strokeLinejoin="round"

                        strokeWidth="2"

                        d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"

                      />

                    </svg>



                    <div>


                      <p className="text-sm font-medium text-blue-900">

                        Super Admin Broadcast

                      </p>


                      <p className="mt-1 text-xs text-blue-700">

                        This message will be distributed as a platform-level announcement.

                        Individual school targeting is not required.

                      </p>


                    </div>



                  </div>


                </div>







                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">


                  <div className="min-h-5">


                    {
                      successMessage && (

                        <div className="text-sm text-emerald-600">

                          {successMessage}

                        </div>

                      )
                    }



                    {
                      errorMessage && (

                        <div className="text-sm text-red-600">

                          {errorMessage}

                        </div>

                      )
                    }


                  </div>





                  <button


                    type="submit"


                    disabled={isSubmitting}


                    className="rounded-lg bg-[#1B2559] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#141c45] disabled:opacity-50"


                  >


                    {
                      isSubmitting

                      ?

                      'Broadcasting...'

                      :

                      'Broadcast Announcement'

                    }


                  </button>



                </div>




              </form>



            </div>


          </div>


        </div>





        {/* RIGHT SIDE PREVIEW */}

        <div className="space-y-6 lg:col-span-1">


          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">


              <span className="h-2 w-2 rounded-full bg-blue-600"/>


              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">

                Live Preview

              </span>


            </div>


            <div className="p-5">


              <span

                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${activeType.badgeClasses}`}

              >

                {activeType.label}

              </span>



              <h3 className="mt-4 text-base font-semibold text-gray-900">

                {
                  title.trim()

                  ?

                  title

                  :

                  <span className="text-gray-300">

                    Announcement title

                  </span>

                }

              </h3>



              <p className="mt-2 text-sm text-gray-600 line-clamp-5">


                {
                  content.trim()

                  ?

                  content

                  :

                  <span className="text-gray-300">

                    Your message preview will appear here...

                  </span>

                }


              </p>



              <div className="mt-4 border-t border-gray-100 pt-3">


                <span className="text-xs text-gray-500">

                  🌐 Global Network

                </span>


              </div>


            </div>


          </div>
                    {/* COMPOSE TIPS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">


            <div className="flex items-center gap-2">


              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />

              </svg>


              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">

                Composing Tips

              </span>


            </div>




            <ul className="mt-4 space-y-3">


              {COMPOSE_TIPS.map((tip,index)=>(


                <li

                  key={index}

                  className="flex gap-2 text-sm text-gray-600"

                >


                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"/>


                  <span>

                    {tip}

                  </span>


                </li>


              ))}


            </ul>


          </div>



        </div>



      </div>



    </div>


  );


}