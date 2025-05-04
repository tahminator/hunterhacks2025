# Aller-Free (HunterHack2025 Submission)
Group Members: Tahmid Ahmed, Angela Yu, Alexon Abreu Ramirez, Daniel Sooknanan

## What is Aller-Free?
If you've organized a hackathon (or any large-scale event), I'm sure you know *fully* well how tedious catering for 
every single dietary restriction. Maybe you're going out with someone who has Celiac Disease, and you're wondering, 
what's gluten. Can they eat this? 

Step in Aller-Free. We've built out a web-extension *and* mobile app that lets you take a photo of whatever menu you'd like and see what items 
they can eat there! Just snap a picture with your phone, or right click, highlight the space you want to select, and you're done. 

## The Design
View the Figma [here](https://www.figma.com/design/j3uM9FHZ9OMmTNneKodYVc/Allergy-Detector?node-id=10-237&t=Sb9OY3XHgqI433ax-1)! We worked pretty hard on it.

## The Tech Stack
We have 3 different codebases:
- Node 
- React
- React-Native

Under the hood, we've opted for **two** AI/ML integrations, one for OCR (select *only* the text elements in the image) using Tesseract JS, and a LLM to 
reason about whether or not the given food items *may* contain the allergens. 
