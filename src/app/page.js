"use client";
import Head from 'next/head'; // Import the Head component
import {BsFillMoonStarsFill} from 'react-icons/bs';
import {AiFillGithub, AiFillLinkedin, AiFillYoutube} from 'react-icons/ai';
import Image from "next/image";
import sarthak from '../../public/sarthak.jpg';
import android from '../../public/android-logo.jpg';
import mern from '../../public/MERN.jpeg';
import dataScience from '../../public/data-science.jpg';
import { useState } from 'react';
import Chatbot from "../components/Chatbot";


export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={darkMode?"dark": ""}>
      {/* Use the Head component to add metadata */}
      <Head>
        <title>Sarthak Vashistha Portfolio</title>
        <meta name="description" content="Generated by Sarthak Vashistha" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
  <nav className="py-4 px-10 flex justify-between items-center">
    <h1 className="text-xl font-bold text-teal-500">Sarthak Vashistha</h1>
    <ul className="flex space-x-6">
      <li>
        <a
          href="#about"
          className="text-gray-700 dark:text-white hover:text-teal-500 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("about").scrollIntoView({ behavior: "smooth" });
          }}
        >
          About
        </a>
      </li>
      <li>
        <a
          href="#skills"
          className="text-gray-700 dark:text-white hover:text-teal-500 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("skills").scrollIntoView({ behavior: "smooth" });
          }}
        >
          Skills
        </a>
      </li>
      <li>
        <a
          href="#portfolio"
          className="text-gray-700 dark:text-white hover:text-teal-500 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("portfolio").scrollIntoView({ behavior: "smooth" });
          }}
        >
          Portfolio
        </a>
      </li>
    </ul>
  </nav>
</header>

      
      <main className="bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 px-10 md:px-20 lg:px-40 pt-20">

        <section id="about" className="min-h-screen">
          <nav className= "py-10 mb-12 flex justify-between dark:bg-white">
          {/* <h1 className='text-xl  font-burtons '>Developed by Sarthak Vashistha with ♥️ </h1> */}
          <ul className="flex items-center">
              {/* <li>
                <BsFillMoonStarsFill onClick={()=> setDarkMode(!darkMode)
                } className='cursor-pointer text-2xl'/>
              </li> */}
              <li><a  className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-md ml-8' 
              href = "https://drive.google.com/file/d/1xD1Lgkzj84BWdTKrw3GZcrIQYOVQrdVv/view?usp=sharing">Resume</a></li>
          </ul>
          </nav>
          <div className='text-center p-10 '>
          
            <h2 className='text-5xl py-2 text-teal-600 dark:text-teal-400font-medium md:text-6xl'> Sarthak Vashistha</h2>
            <h3 className='text-2xl py-2 md:text-3xl'> Software Developer</h3>
            <p className=' text-md py-5 leading-8 text-grey-800 md:text-xl max-w-xl mx-auto'>A dedicated Software Developer specializing in Android and React Native development, I am passionate about creating innovative and efficient solutions that enhance user experiences and drive business success. With a diverse skill set in both mobile and web development, I bring a comprehensive approach to every project, ensuring robust and scalable applications.
            </p>
            
          </div>
          <div className='text-5xl flex justify-center gap-16 py-3 text-gray-600'>
            <a href='https://www.linkedin.com/in/sarthak-vashistha/'>
            <AiFillLinkedin />
            </a>
            <a href='https://github.com/Insitium?tab=repositories'>
            <AiFillGithub />
            </a>
            <a href='https://www.youtube.com/@sarthakvashistha6290/videos'>
            <AiFillYoutube href='https://www.youtube.com/@sarthakvashistha6290/videos'/>
            </a>
          </div>
          <div className='relative mx-auto bg-gradient-to-b from-teal-600 rounded-full w-80 h-80 mt-20 overflow-hidden md:h-96 md:w:96'>
            <Image 
            src={sarthak} 
            alt = {'Emoji of ${name}'}
            ayout ='fill' 
            objectFit ='cover'
            />
          </div>
        </section>
        <section id ="skills" className='py-20'>
          <div>
            <h3 className='text-3xl py-1'> Skills </h3>
            <h6 className='text-2xl py-1'> Software Developer </h6>
            <p className='text-md py-2 leading-8 text-gray-800'>As a dedicated software Developer I have worked on technologies such as <span className="text-teal-500">React</span>(Like this website),<span className="text-teal-500"> React Native, Node, MongoDB, Express and Rest APIs, Android - Jetpack Compose</span>.</p>
            <div className='lg:flex lg:flex-wrap gap-10'>
            <div className='text-center shadow-lg p-10 rounded-xl my-10 dark:bg-white flex-1'>
              <div className='flex justify-center'>
              <Image src={mern}
              alt = {'Emoji of MERN Stack'}
              width ={100}
              height={100}/>
              </div>
              <h3 className='text-lg font-medium pt-8 pb-2 font-bold'>Full Stack</h3>
              <p className='py-2'>Mastering full-stack development, one line of code at a time.</p>
              <h3 className='py-4 text-teal-600 text-xl'> Tools & Techniques </h3>
              <p className='text-gray-800 py-1'>React Native</p>
              <p className='text-gray-800 py-1'>React.js</p>
              <p className='text-gray-800 py-1'>Node.js</p>
              <p className='text-gray-800 py-1'>Mongo DB</p>
            </div>
            <div className='text-center shadow-lg p-10 rounded-xl my-10 dark:bg-white flex-1' >
              <div className='flex justify-center'>
              <Image src={android}
              alt = {'Emoji of android'}
              width ={100}
              height={100}/>
              </div>
              <h3 className='text-lg font-medium pt-8 pb-2 font-bold'>Android Development</h3>
              <p className='py-2'>Modern, declarative Android UI toolkit for sleek, dynamic app interfaces.</p>
              <h4 className='py-4 text-teal-600 text-xl'> Tools & Techniques </h4>
              <p className='text-gray-800 py-1'>Jetpack Compose</p>
              <p className='text-gray-800 py-1'>MVVM Architecture</p>
              <p className='text-gray-800 py-1'>Kotlin</p>
            </div>
          </div>
            <br/>
            <h6 className='text-2xl py-1 font-bold'> Data Science </h6>
            <p>
              Passionate about leveraging <span className="text-teal-500">Python, SQL </span> and <span className="text-teal-500">Machine Learning </span>to analyze data, build predictive models, and deliver actionable insights that solve complex problems and drive data-driven decision-making.
            </p>
           
          </div>
          <div className='lg:flex gap-10 justify-center items-center'>
           
            <div className='text-center shadow-lg p-10 rounded-xl my-10 dark:bg-white'>
              <div className='flex justify-center'>
              <Image src={dataScience}
              alt = {'Emoji of Data Science'}
              width ={100}
              height={100}/>
              </div>
              <h3 className='text-lg font-medium pt-8 pb-2 font-bold'>Data Science</h3>
              <p className='py-2'>Transforming raw data into actionable insights with cutting-edge tools and techniques.</p>
              <h3 className='py-4 text-teal-600 text-xl'> Tools & Techniques</h3>
              <p className='text-gray-800 py-1'>Python (NumPy, Pandas, Scikit-learn)</p>
              <p className='text-gray-800 py-1'>SQL</p>
              <p className='text-gray-800 py-1'>Data Cleaning & EDA</p>
              <p className='text-gray-800 py-1'>Machine Learning</p>
              <p className='text-gray-800 py-1'>Predictive Analytics</p>
            </div>
            
          </div>
        </section>
        <section id ='portfolio' className='py-20'>
          <div>
            <h3 className='text-3xl py-1'> Portfolio</h3>
            
          </div>
         
          <div className='shadow-lg p-10 rounded-xl my-10 dark:bg-white text-center'>
            <div className='video-container mb-6'> 
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/F2YT74ygsXc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className='technologies-used'>
              <h3 className='text-xl font-bold mb-4 text-teal-500'>Technologies Used:</h3>
              <ul className='list-disc list-inside'>
                <ul>React Native</ul>
                <ul>Fire Base</ul>
                <ul>Built an Alumni Portal with React Native (frontend) and Firebase (backend), featuring login/auth, posts, comments, search, profile editing, and batchmate content access. </ul>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Chatbot />
    </div>
  );
}
