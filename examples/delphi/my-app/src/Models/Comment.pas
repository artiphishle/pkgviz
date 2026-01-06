unit Models.Comment;

interface

uses
  System.SysUtils;

type
  TComment = class
  private
    FId: Integer;
    FTaskId: Integer;
    FUserId: Integer;
    FContent: string;
    FCreatedAt: TDateTime;
    FUpdatedAt: TDateTime;
  public
    constructor Create;
    destructor Destroy; override;
    
    function GetId: Integer;
    procedure SetId(const AId: Integer);
    
    function GetTaskId: Integer;
    procedure SetTaskId(const ATaskId: Integer);
    
    function GetUserId: Integer;
    procedure SetUserId(const AUserId: Integer);
    
    function GetContent: string;
    procedure SetContent(const AContent: string);
    
    function GetCreatedAt: TDateTime;
    function GetUpdatedAt: TDateTime;
  end;

implementation

constructor TComment.Create;
begin
  inherited;
  FCreatedAt := Now;
  FUpdatedAt := Now;
end;

destructor TComment.Destroy;
begin
  inherited;
end;

function TComment.GetId: Integer;
begin
  Result := FId;
end;

procedure TComment.SetId(const AId: Integer);
begin
  FId := AId;
end;

function TComment.GetTaskId: Integer;
begin
  Result := FTaskId;
end;

procedure TComment.SetTaskId(const ATaskId: Integer);
begin
  FTaskId := ATaskId;
end;

function TComment.GetUserId: Integer;
begin
  Result := FUserId;
end;

procedure TComment.SetUserId(const AUserId: Integer);
begin
  FUserId := AUserId;
end;

function TComment.GetContent: string;
begin
  Result := FContent;
end;

procedure TComment.SetContent(const AContent: string);
begin
  FContent := AContent;
  FUpdatedAt := Now;
end;

function TComment.GetCreatedAt: TDateTime;
begin
  Result := FCreatedAt;
end;

function TComment.GetUpdatedAt: TDateTime;
begin
  Result := FUpdatedAt;
end;

end.
