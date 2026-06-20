 // --- PASO 2: GENERAR IMÁGENES EN PARALELO ---
        // const [responseLogo, responseMockup] = await Promise.all([
        //     axios.post(
        //         "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", /*stable-diffusion-xl-1024-v1-0*/
        //         {
        //             text_prompts: [{ text: brief.logo_prompt }],
        //             cfg_scale: 7,
        //             height: 1024,
        //             width: 1024,
        //             steps: 30,
        //             samples: 1,
        //         },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        //                 'Content-Type': 'application/json',
        //                 Accept: 'application/json',
        //             }
        //         }
        //     ),
        //     axios.post(
        //         "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", /**/
        //         {
        //             text_prompts: [{ text: brief.mockup_prompt }],
        //             cfg_scale: 7,
        //             height: 1024,
        //             width: 1024,
        //             steps: 30,
        //             samples: 1,
        //         },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        //                 'Content-Type': 'application/json',
        //                 Accept: 'application/json',
        //             }
        //         }
        //     )
        // ]);

        // const logo_base64 = responseLogo.data.artifacts?.[0]?.base64;
        // const mockup_base64 = responseMockup.data.artifacts?.[0]?.base64;
        // if (!logo_base64) throw new Error("No se recibió imagen de Stability (logo)");
        // // Rutas únicas
        // const logoFilename = `logo_${Date.now()}.png`;
        // const mockupFilename = `mockup_${Date.now()}.png`;

        // const logoPath = path.join(uploadDir, logoFilename);
        // const mockupPath = path.join(uploadDir, mockupFilename);
        
        // // Guardar archivos
        // fs.writeFileSync(logoPath, Buffer.from(logo_base64, "base64"));
        // fs.writeFileSync(mockupPath, Buffer.from(mockup_base64, "base64"));