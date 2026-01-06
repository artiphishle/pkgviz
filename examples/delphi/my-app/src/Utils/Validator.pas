unit Utils.Validator;

interface

uses
  System.SysUtils,
  System.RegularExpressions;

type
  TValidator = class
  public
    constructor Create;
    destructor Destroy; override;
    
    function ValidateEmail(const AEmail: string): Boolean;
    function ValidateString(const AString: string; AMinLength, AMaxLength: Integer): Boolean;
    function ValidateNumber(const AValue: Integer; AMin, AMax: Integer): Boolean;
    function ValidateDate(const ADate: TDateTime): Boolean;
    function IsEmpty(const AString: string): Boolean;
  end;

implementation

constructor TValidator.Create;
begin
  inherited;
end;

destructor TValidator.Destroy;
begin
  inherited;
end;

function TValidator.ValidateEmail(const AEmail: string): Boolean;
const
  EmailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$';
begin
  Result := TRegEx.IsMatch(AEmail, EmailPattern);
end;

function TValidator.ValidateString(const AString: string; AMinLength, AMaxLength: Integer): Boolean;
var
  Len: Integer;
begin
  Len := Length(AString);
  Result := (Len >= AMinLength) and (Len <= AMaxLength);
end;

function TValidator.ValidateNumber(const AValue: Integer; AMin, AMax: Integer): Boolean;
begin
  Result := (AValue >= AMin) and (AValue <= AMax);
end;

function TValidator.ValidateDate(const ADate: TDateTime): Boolean;
begin
  Result := ADate > 0;
end;

function TValidator.IsEmpty(const AString: string): Boolean;
begin
  Result := Trim(AString) = '';
end;

end.
