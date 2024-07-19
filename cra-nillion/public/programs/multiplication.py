import time
from nada_dsl import *

def nada_main():
    party1 = Party(name="Party1")
    party2 = Party(name="Party2")
    a = SecretInteger(Input(name="my_int_1", party=party1))
    b = SecretInteger(Input(name="my_int_2", party=party2))

    new_int = a * b 

    return [Output(new_int, "my_output", party2)]