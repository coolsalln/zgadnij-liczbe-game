import random

# Konfiguracja poziomów trudności
GAME_CONFIG = {
    1: {"name": "Łatwy", "range": 50, "attempts": 10},
    2: {"name": "Średni", "range": 100, "attempts": 7},
    3: {"name": "Trudny", "range": 1000, "attempts": 5}
}

def get_valid_input(prompt, valid_options=None, min_val=None, max_val=None, input_type=int):
    """
    Pobiera i waliduje wejście od użytkownika.
    
    Args:
        prompt (str): Tekst wyświetlany użytkownikowi.
        valid_options (list, optional): Lista dozwolonych wartości.
        min_val (int, optional): Minimalna dozwolona wartość.
        max_val (int, optional): Maksymalna dozwolona wartość.
        input_type (type, optional): Oczekiwany typ danych (domyślnie int).
        
    Returns:
        Wartość wprowadzona przez użytkownika w zadanym typie.
    """
    while True:
        try:
            user_input = input(prompt)
            value = input_type(user_input)
            
            if valid_options and value not in valid_options:
                print(f"Błąd: Proszę wybrać jedną z opcji: {valid_options}")
                continue
                
            if min_val is not None and value < min_val:
                print(f"Błąd: Wartość musi być większa lub równa {min_val}.")
                continue

            if max_val is not None and value > max_val:
                print(f"Błąd: Wartość musi być mniejsza lub równa {max_val}.")
                continue
                
            return value
        except ValueError:
            print(f"Błąd: Proszę wprowadzić poprawną wartość typu {input_type.__name__}.")

def guess_number_game():
    print("-----------------------------------------")
    print("      Witaj w grze 'Zgadnij liczbę'      ")
    print("-----------------------------------------")

    print("\nWybierz poziom trudności:")
    print("1. Łatwy (1-50, 10 prób)")
    print("2. Średni (1-100, 7 prób)")
    print("3. Trudny (1-1000, 5 prób)")

    choice = get_valid_input("Twój wybór (1-3): ", valid_options=[1, 2, 3])
    
    level = GAME_CONFIG[choice]
    target_number = random.randint(1, level["range"])
    attempts_left = level["attempts"]
    
    print(f"\nRozpoczynamy grę na poziomie: {level['name']}")
    print(f"Musisz zgadnąć liczbę od 1 do {level['range']}.")
    
    while attempts_left > 0:
        print(f"\nPozostało prób: {attempts_left}")
        guess = get_valid_input("Podaj swoją liczbę: ", min_val=1, max_val=level['range'])
        
        if guess == target_number:
            print(f"\nGRATULACJE! Zgadłeś liczbę {target_number}!")
            break
        elif guess < target_number:
            print("Za mało! Spróbuj wyższej liczby.")
        else:
            print("Za dużo! Spróbuj niższej liczby.")
            
        attempts_left -= 1
        
    if attempts_left == 0:
        print(f"\nKoniec gry! Szukana liczba to: {target_number}.")

if __name__ == "__main__":
    while True:
        guess_number_game()
        play_again = get_valid_input("\nCzy chcesz zagrać ponownie? (t/n): ", valid_options=['t', 'n', 'T', 'N'], input_type=str).lower()
        if play_again != 't':
            print("Dziękuję za grę!")
            break
