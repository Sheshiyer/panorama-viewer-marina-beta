import os
import shutil
import subprocess

# Mapping of elevation to floor number
ELEVATION_MAP = {
    "154m": 44,
    "167m": 48,
    "182m": 52,
    "196m": 56,
    "210m": 60,
    "224m": 64,
    "238m": 68,
    "252m": 72,
    "266m": 75
}

# Mapping of time folders to target names
TIME_MAP = {
    "Morning View": "morning",
    "Day View": "noon",
    "Evening View": "evening",
    "Night View": "night"
}

# Mapping of direction keywords to target names
DIRECTION_MAP = {
    "sea": "sea",
    "central": "sea",
    "marine": "marine",
    "stadium": "stadium"
}

BASE_DIR = os.path.abspath(".processing")
TARGET_DIR = os.path.abspath("public/assets/panoramas")

def get_best_image(path):
    if not os.path.exists(path):
        return None
    files = [f for f in os.listdir(path) if f.lower().endswith(('.jpg', '.jpeg'))]
    if not files:
        return None
    
    # Prefer files with "copy" as they often represent processed versions, 
    # but prioritize ones that seem like the final output
    files.sort(key=lambda x: ("copy" in x.lower(), len(x)), reverse=True)
    return os.path.join(path, files[0])

def main():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)

    for time_folder, time_key in TIME_MAP.items():
        time_path = os.path.join(BASE_DIR, time_folder)
        if not os.path.exists(time_path):
            print(f"Time folder not found: {time_path}")
            continue

        for elev_folder, floor_num in ELEVATION_MAP.items():
            elev_path = os.path.join(time_path, elev_folder)
            if not os.path.exists(elev_path):
                # Try lower case if not found
                elev_path = os.path.join(time_path, elev_folder.lower())
                if not os.path.exists(elev_path):
                    continue

            for dir_folder in os.listdir(elev_path):
                dir_path = os.path.join(elev_path, dir_folder)
                if not os.path.isdir(dir_path):
                    continue

                # Identify direction
                found_dir = None
                for keyword, target in DIRECTION_MAP.items():
                    if keyword in dir_folder.lower():
                        found_dir = target
                        break
                
                if not found_dir:
                    continue

                best_img = get_best_image(dir_path)
                if best_img:
                    target_filename = f"floor-{floor_num}-{time_key}-{found_dir}.jpg"
                    target_path = os.path.join(TARGET_DIR, target_filename)
                    
                    print(f"Mapping: {best_img} -> {target_filename}")
                    shutil.copy2(best_img, target_path)

if __name__ == "__main__":
    main()
