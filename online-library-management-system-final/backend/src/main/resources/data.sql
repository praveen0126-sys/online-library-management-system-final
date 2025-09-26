-- Default Users (password is 'password123' for all users)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@library.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN'),
('John Doe', 'user@library.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER'),
('Jane Smith', 'jane@library.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER'),
('Sai Kumar', 'sai12@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER');

-- Books with Title-Specific Cover Images and Random Prices (200-500 range)
INSERT INTO books (title, author, isbn, category, available_copies, total_copies, cover_image_url, price) VALUES
-- Telugu Literature - Title-specific covers
('A Thousand Hoods', 'Viswanatha Satyanarayana', '978-81-7525-001-1', 'Telugu Literature', 5, 5, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR4UVM5ZvFFuju5P3nP3Cu0mJNEF_TnGKhY441iFLS4lFEH9hVRL6TFPElRSNcf', 425.00),
('Kanyasulkam (Bride Price)', 'Gurajada Apparao', '978-81-7525-002-2', 'Telugu Literature', 4, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_5e6hdK5Tsd97bk6sTQaA7Ddnm37H9FLkUyWngg10raqIDC0ZUnZEmCtNf4ef', 385.00),
('Malleswari', 'Bandaru Acchamamba', '978-81-7525-003-3', 'Telugu Literature', 3, 4, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ9Dk3eRxcI9F2cUZopp9gxe2WuU56zVZBe0o0UVz9wA8c5kcLSFHgqvi4PZ5Uo', 320.00),
('Chitralekha', 'Krishna Sastri', '978-81-7525-004-4', 'Telugu Literature', 6, 6, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSTboPax0WtZFMhCEhj-_8NX9MER3BXMtG2AI6W8v7lqPB6G8tegV-4aNX8PqQa', 465.00),
('The Night of Nectar Rain', 'Rayaprolu Subbarao', '978-81-7525-005-5', 'Telugu Literature', 4, 5, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTyDy-Cq4NnALO-FsG6mHFrlNZffLoKgu4fbFn0LJ_ak76S79IEATeCly5mz1SG', 360.00),

-- Telugu Poetry - Poetry and nature themed covers
('The Great Journey', 'Sri Sri', '978-81-7525-006-6', 'Telugu Poetry', 3, 4, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRCVkUwr9lEZybT3OqY_ZNEBAlH4QFcCWbleosjIvvLRT5Spvlozl1e-6reM1I0', 285.00),
('Knowledge of Time', 'Viswanatha Satyanarayana', '978-81-7525-007-7', 'Telugu Poetry', 5, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFSQz4MWI2JT79-1V65sMQobdY4lcCD6vNi-YtaZwDaeP4Ux7ioMe3hfb6g_eV', 340.00),
('Shadow', 'Gurajada Apparao', '978-81-7525-008-8', 'Telugu Poetry', 2, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdRUu0tLL3SJXeXsKqcuN4BrBYIewRa4CY7gsTuAoaQaVExswIwKaL_zfy0JZY', 255.00),

-- Telugu History - Historical monuments and heritage
('History of Andhra', 'K.R. Venkataraman', '978-81-7525-009-9', 'Telugu History', 4, 5, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSBCqaH--4ZCaYS28NzH9hp_-YWB62wRr0odp9uxiQ8cYkSiOSpPgmIt1on0Z9o', 475.00),
('History of Telugu Land', 'P. Raghavendrarao', '978-81-7525-010-0', 'Telugu History', 3, 4, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR1JrpaMpCyR8Gm-mVOd9Jzl42D-dZfCl_I_uQr_DCLj0OD1pZ8EoFFQiUAN7Nt', 445.00),

-- Telugu Science - Science and technology themed
('Encyclopedia of Science', 'Dr. K.V. Raman', '978-81-7525-011-1', 'Telugu Science', 5, 6, 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTmkUZqImxpIfBefT0nsZO1tW1fQShshiwYzV-5_3yCVon7ShSI8yWAxUO396DSzrpWSBOkYhnyMfx8GEZPtaUqNLLwlWWv0ddhdt86-fwMFqyt_jQ', 495.00),
('Secrets of Mathematics', 'Professor Ramakrishna', '978-81-7525-012-2', 'Telugu Science', 4, 4, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTqAgPZx3O254yWMg9ki3Cu4PklKdLsSF9OebY8ebWzAXCAP_wnMUnaSJAMIzDG', 485.00),

-- Telugu Philosophy - Spiritual and philosophical imagery
('Philosophy of Life', 'Vedavyasa', '978-81-7525-013-3', 'Telugu Philosophy', 3, 4, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRPV59Ea68Ia75AWuFi-pGf2d0Q9Vsv7NCWPec3LK5xS9mXeoJnQey3YM953KHu', 420.00),
('Dharma Shastra', 'Maharshi Valmiki', '978-81-7525-014-4', 'Telugu Philosophy', 2, 3, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQZyNwAQ9UKYLr4vddu4jRzRAXXNtg5QS5xg33JHoSNstgfJe7MUBnh786oG3-x', 380.00),

-- Telugu Children Books - Colorful and child-friendly
('Stories for Little Ones', 'Balasauri', '978-81-7525-015-5', 'Telugu Children', 8, 10, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTzWmRC5r1PyuA795SVt0FyB_3LHMTQ0QHef_uJQzg-ckOFzuwSOxCS2n_bY90-', 220.00),
('Children Songs', 'Devulapalli Krishnasastri', '978-81-7525-016-6', 'Telugu Children', 7, 8, 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRIZap5-vLsrUdyMGG1F-_NcDpnrIQFBPLMEM2Iv5Iwly251gUE27CKhnBwmkpo42xtR2v6IOssZPRsyJ4vfkW-6FS5ouc1YvcZYCBWgi9CM9cqIe4', 210.00),
('Moral Stories', 'Kandukuri Veeresalingam', '978-81-7525-017-7', 'Telugu Children', 6, 7, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSdIxhMpHD8cRwgVWYZz_Z038zLrWfylnSosnb3MgqHJGi0xBik_5Ldahv66PUX', 235.00),

-- Popular English Books - Book-specific imagery
('The God of Small Things', 'Arundhati Roy', '978-0-679-45731-4', 'Fiction', 4, 5, 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT1qLeTamcynChD44UWdYfTQ_i9lBMV8vGyMyaGDi60oIpngs-DHh51ghQLar1esEVuY2UM7HwLQsz2kPicye9XjQSYOfO7ckv8E5yPc-1YHwu-HSU', 450.00),
('Wings of Fire: An Autobiography', 'A.P.J. Abdul Kalam', '978-81-7371-146-6', 'Biography', 6, 8, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQsm6ZBq8FqcQJ005MfHoYMB8N5nNGUqlvQiw6SaaE-XBIUx8qSTiLLcZfKfbBq', 350.00),
('The White Tiger', 'Aravind Adiga', '978-1-4165-4928-9', 'Fiction', 3, 4, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRmER89dheT5QSHo1tVbmgb0G_ABfQ5gEFsY9Zxxu1vDrBRD6XGiiNOFV4ydIWQ', 480.00),

-- Classic Hindi Literature - Indian cultural imagery
('Godan (The Gift of a Cow)', 'Munshi Premchand', '978-81-7119-250-3', 'Hindi Literature', 5, 6, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRkyPz8XEH3ygcJTAXTl-GkG88ygHLdohIZxutehd1Wa2LfkDA_K6AS8iMgaE9c', 325.00),
('These Days of Green Grass', 'Phanishwarnath Renu', '978-81-7119-251-4', 'Hindi Literature', 4, 5, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQn6zlP0IT00iBqgePLxMBpjWvkrOJNR8aJrc08LPGc_05Z02P9mjslUsIHEmCK', 295.00),

-- Additional Popular Books - Title-specific covers
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Classic Fiction', 5, 6, 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSPeC_CPlrev76-HgjqHYCNPrBGVMu-MMBmrgYqxuTKi-MmN_McEY7j9PMTuxDCfEx79ISVweprStNrVVRha3t4vQGPVPjjkeZ0Bht1BefIm9TWMyI', 415.00),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'Romance', 4, 5, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQRRFcWF1FwcCBFWmz2xveBlyuK7Eo1Enl4NBplRRSKJn7pBO4k109kJsUBRnsD', 375.00),
('The Alchemist', 'Paulo Coelho', '978-0-06-231500-7', 'Philosophy', 6, 7, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRZ8EGsOy35AiuysERPVkU4DBXYKUREwGWCxwIvjirjU8t8-m6QNnCBDb7WyTLm', 355.00),
('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', '978-0-439-70818-8', 'Fantasy', 8, 10, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSu5AJqlXXOaBA_ijPQd8MwlhG-s2IIQTe6kyvRDEFdrEGun31F4C2d6M-BbYPk', 455.00),
('The Hobbit', 'J.R.R. Tolkien', '978-0-547-92822-7', 'Fantasy', 5, 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9jieYsnRaSbvFvNPHuCkZAnaIf6YRQWSVE15WwC9AyNXpg-yCV3lAegUxcYG1', 395.00);
